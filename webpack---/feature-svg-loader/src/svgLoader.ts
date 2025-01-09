import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	Props,
	IPropsStore,
	ILogger,
	LoggerSymbol,
	NavigationManagerSymbol,
	INavigationManager,
	BrowserWindowSymbol,
	BrowserWindow,
} from '@wix/thunderbolt-symbols'
import type { SvgLoaderPageConfig, ISvgContentBuilder } from './types'
import { SvgContentBuilderSymbol, name } from './symbols'
import { isSSR } from '@wix/thunderbolt-commons'
import { createSvgProps, getSvgContentAndInfoFromDom, updateSvgProps } from './helpers'
import _ from 'lodash'

export const SvgLoader = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		SvgContentBuilderSymbol,
		Props,
		LoggerSymbol,
		NavigationManagerSymbol,
		BrowserWindowSymbol,
	],
	(
		pageFeatureConfig: SvgLoaderPageConfig,
		svgContentBuilder: ISvgContentBuilder,
		propsStore: IPropsStore,
		logger: ILogger,
		navigationManager: INavigationManager,
		window: NonNullable<BrowserWindow>
	): IPageWillMountHandler => {
		return {
			name: 'svgLoader',
			async pageWillMount() {
				const isClient = !isSSR(window)
				await logger.runAsyncAndReport(
					() =>
						Promise.all(
							_.map(pageFeatureConfig.compIdToSvgDataMap, async (svgData, compId) => {
								const { componentType } = svgData
								// Get the svg data from the DOM on client side, if on server or if there's a client fallback, fetch it from svgContentBuilder
								const svgDataResult =
									(isClient &&
										logger.runAndReport(
											() => getSvgContentAndInfoFromDom(compId),
											'svgLoader',
											'getSvgContentAndInfoFromDom'
										)) ||
									(await svgContentBuilder({ ...svgData, compId }))
								if (svgDataResult) {
									const svgProps = createSvgProps(componentType, svgDataResult)
									updateSvgProps(compId, svgProps, propsStore)
								} else {
									logger.captureError(new Error(`Failed to load svg content for compId: ${compId}`), {
										tags: { feature: name, compId },
									})
								}
							})
						),
					name,
					`loadSvgContent:${
						isClient ? (navigationManager.isFirstNavigation() ? 'client-first-page' : 'navigation') : 'ssr'
					}`
				)
			},
		}
	}
)
