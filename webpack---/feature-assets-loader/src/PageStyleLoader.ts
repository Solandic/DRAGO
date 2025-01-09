import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CssFetcherSymbol,
	CssSiteAssetsParams,
	DomReadySymbol,
	Experiments,
	ExperimentsSymbol,
	HeadContentSymbol,
	ICssFetcher,
	IHeadContent,
	ILogger,
	IPageResourceFetcher,
	LoggerSymbol,
	PageResourceFetcherSymbol,
	SiteFeatureConfigSymbol,
	ViewerModel,
	ViewerModelSym,
	SiteAssetsResources,
} from '@wix/thunderbolt-symbols'
import { LocalClientCssFetcher } from './LocalClientPageStyleLoader'
import { AssetsLoaderSiteConfig } from './types'
import { name } from './symbols'

const accCssResultObject: { [pageId: string]: { [compId: string]: { [featureName: string]: any } } } = {}

const accumulateCssResults = (pageId: string, cssResultObject: SiteAssetsResources['css']['cssResultObject']) => {
	if (!cssResultObject) {
		return
	}

	if (!(pageId in accCssResultObject)) {
		accCssResultObject[pageId] = {}
	}

	Object.entries(cssResultObject).forEach(([compId, featureCssResult]) => {
		if (!(compId in accCssResultObject[pageId])) {
			accCssResultObject[pageId][compId] = {}
		}
		accCssResultObject[pageId][compId] = {
			...accCssResultObject[pageId][compId],
			...featureCssResult,
		}
	})
}

const shouldAddCssObjectToWindow = (viewerModel: ViewerModel, pageId: string) =>
	viewerModel.siteAssets.modulesParams.css.shouldGetCssResultObject && pageId !== 'masterPage'

// compCssMappers has to be the last feature to run
const featuresToIgnoreList = ['stylableCss', 'compCssMappers']
const getFeaturesToRunInIsolation = (requestUrl: string, isStylableComponentInStructure: boolean) => {
	const featuresFromUrl = new URL(requestUrl).searchParams.get('cssFeaturesToRun')
	// validate that the features are alphanumeric, comma separated
	if (featuresFromUrl && /^[\w,-]+$/.test(featuresFromUrl)) {
		return featuresFromUrl.split(',')
	}
	return featuresToIgnoreList.filter((feature) => feature !== 'stylableCss' || isStylableComponentInStructure)
}

const fetchCssInParallel = (
	featuresToRunInIsolation: Array<string>,
	fetcher: (
		cssModule: 'css' | 'cssMappers',
		params: Partial<CssSiteAssetsParams>
	) => Promise<SiteAssetsResources['css']>
) => {
	const getFetcherReturnValue = (id: string) => (result: Awaited<ReturnType<typeof fetcher>>) => ({
		id,
		css: result.css,
	})

	const mainCssPromise = fetcher('css', {
		featuresToIgnore: featuresToRunInIsolation.join(','),
	}).then(getFetcherReturnValue('css'))
	const isolatedFeaturesPromises = featuresToRunInIsolation.map((feature) =>
		fetcher(feature === 'compCssMappers' ? 'cssMappers' : 'css', {
			featuresToRun: feature,
		}).then(getFetcherReturnValue(feature))
	)

	return Promise.all([mainCssPromise, ...isolatedFeaturesPromises])
}

export type ILoadPageStyle = {
	load(pageId: string, loadComponentsPromise?: Promise<any>): Promise<void>
}

export const PageMainCssFetcher = withDependencies<ICssFetcher>(
	[PageResourceFetcherSymbol, ViewerModelSym],
	(pageResourceFetcher: IPageResourceFetcher, viewerModel: ViewerModel) => ({
		id: 'css',
		fetch: (pageId, cssModule = 'css', extraModuleParams) => {
			const fetchPromise = pageResourceFetcher.fetchResource<'css' | 'cssMappers'>(
				pageId,
				cssModule,
				extraModuleParams
			)

			// Accumulate css results only if we need to get the page css
			if (viewerModel.siteAssets.modulesParams.css.shouldGetCssResultObject) {
				fetchPromise.then(({ cssResultObject }) => {
					accumulateCssResults(pageId, cssResultObject)
				})
			}
			return fetchPromise
		},
	})
)

export const toDomId = (id: string, pageId: string) => `${id}_${pageId}`

async function getStyles(
	pageId: string,
	requestUrl: string,
	cssFetcher: ICssFetcher,
	isStylableComponentInStructure: boolean
) {
	const shouldSplitCssGeneration = pageId !== 'masterPage'
	let styles = []
	if (shouldSplitCssGeneration) {
		const featuresToRunInIsolation = getFeaturesToRunInIsolation(requestUrl, isStylableComponentInStructure)
		styles = await fetchCssInParallel(featuresToRunInIsolation, (cssModule, config) =>
			cssFetcher.fetch(pageId, cssModule, config)
		)
	} else {
		const { css } = await cssFetcher.fetch(pageId)
		styles.push({ id: cssFetcher.id, css })
	}
	return styles
}

export const ClientPageStyleLoader = withDependencies<ILoadPageStyle>(
	[
		DomReadySymbol,
		CssFetcherSymbol,
		ViewerModelSym,
		ExperimentsSymbol,
		LoggerSymbol,
		named(SiteFeatureConfigSymbol, name),
	],
	(
		domReadyPromise: Promise<void>,
		cssFetcher: ICssFetcher,
		viewerModel: ViewerModel,
		experiments: Experiments,
		logger: ILogger,
		{ isStylableComponentInStructure }: AssetsLoaderSiteConfig
	) => {
		return {
			async load(pageId, loadComponentsPromise?: Promise<any>): Promise<void> {
				await domReadyPromise
				await logger.runAsyncAndReport(
					async () => {
						if (viewerModel.siteAssets.modulesParams.css.shouldRunCssInBrowser) {
							return LocalClientCssFetcher(cssFetcher, pageId, viewerModel)
						}

						// If SSR already added the css, no need to fetch it again
						if (document.getElementById(toDomId(cssFetcher.id, pageId))) {
							return
						}

						const styles = await getStyles(
							pageId,
							viewerModel.requestUrl,
							cssFetcher,
							isStylableComponentInStructure
						)

						loadComponentsPromise && (await loadComponentsPromise)

						styles.forEach(({ id, css }) => {
							const styleElement = window.document.createElement('style')
							styleElement.setAttribute('id', toDomId(id, pageId))
							styleElement.innerHTML = css
							if (window.viewerModel.experiments['specs.thunderbolt.pagesCssInHead']) {
								window.document.head.appendChild(styleElement)
							} else {
								window.document.getElementById('pages-css')!.appendChild(styleElement)
							}
						})

						if (shouldAddCssObjectToWindow(viewerModel, pageId)) {
							window.debugCssObject = accCssResultObject
						}
					},

					'ClientPageStyleLoader',
					'fetchClientCss'
				)
			},
		}
	}
)

export const ServerPageStyleLoader = withDependencies<ILoadPageStyle>(
	[HeadContentSymbol, CssFetcherSymbol, LoggerSymbol, ViewerModelSym, named(SiteFeatureConfigSymbol, name)],
	(
		headContent: IHeadContent,
		cssFetcher: ICssFetcher,
		logger: ILogger,
		viewerModel: ViewerModel,
		{ isStylableComponentInStructure }: AssetsLoaderSiteConfig
	) => {
		return {
			async load(pageId) {
				await logger.runAsyncAndReport(
					async () => {
						const styles = await getStyles(
							pageId,
							viewerModel.requestUrl,
							cssFetcher,
							isStylableComponentInStructure
						)
						styles.forEach(({ id, css }) => {
							headContent.addPageCss(`<style id="${toDomId(id, pageId)}">${css}</style>`)
						})

						// add script tag (hacky) to define debug css object on window
						if (shouldAddCssObjectToWindow(viewerModel, pageId)) {
							headContent.addPageCss(
								`<script>window.debugCssObject = ${JSON.stringify(accCssResultObject)}</script>`
							)
						}
					},
					'ServerPageStyleLoader',
					'fetchServerCss'
				)
			},
		}
	}
)
