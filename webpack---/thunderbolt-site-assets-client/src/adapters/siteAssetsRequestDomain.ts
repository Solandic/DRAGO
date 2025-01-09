import { FallbackStrategy, SiteAssetsRequest, SitePagesModel } from '@wix/site-assets-client'
import type { TBSiteAssetsRequest } from '../types'
import { filterBeckyExperiments, stringifyExperiments } from '../utils'
import { SiteAssetsRouterUrls } from '@wix/thunderbolt-ssr-api'
import {
	BuilderComponentSiteAssetsParams,
	CssMappersSiteAssetsParams,
	CssSiteAssetsParams,
	Experiments,
	FeaturesSiteAssetsParams,
	MobileAppBuilderSiteAssetsParams,
	ModulesToHashes,
	PlatformSiteAssetsParams,
	SiteAssetsModuleName,
	SiteAssetsResourceType,
	SiteMapSiteAssetsParams,
	SiteScopeParams,
	ViewerModel,
} from '@wix/thunderbolt-symbols'
import _ from 'lodash'

type OneOfSiteAssetsParams =
	| CssSiteAssetsParams
	| CssMappersSiteAssetsParams
	| PlatformSiteAssetsParams
	| FeaturesSiteAssetsParams
	| SiteMapSiteAssetsParams
	| MobileAppBuilderSiteAssetsParams
	| BuilderComponentSiteAssetsParams

type SiteAssetsParamsMap<U> = { [K in SiteAssetsResourceType]: U extends { resourceType: K } ? U : never }
type SiteAssetsParamsTypeMap = SiteAssetsParamsMap<OneOfSiteAssetsParams>
type Pattern<T> = { [K in keyof SiteAssetsParamsTypeMap]: (params: SiteAssetsParamsTypeMap[K]) => T }
function matcher<T>(pattern: Pattern<T>): (params: OneOfSiteAssetsParams) => T {
	// https://github.com/Microsoft/TypeScript/issues/14107
	return (params) => pattern[params.resourceType](params as any)
}

const MAPPERS_ONLY_PARAMS = ['ooiVersions']

const getBaseCssParams = (
	deviceInfo: ViewerModel['deviceInfo'],
	shouldRunVsm: CssSiteAssetsParams['shouldRunVsm'],
	shouldRunCssInBrowser: CssSiteAssetsParams['shouldRunCssInBrowser'],
	shouldGetCssResultObject: CssSiteAssetsParams['shouldGetCssResultObject']
) => {
	return {
		deviceType: deviceInfo.deviceClass,
		...(shouldRunVsm && { shouldRunVsm: 'true' }),
		...(shouldRunCssInBrowser && { shouldReturnResolvedBeckyModel: 'true' }),
		...(shouldGetCssResultObject && { shouldGetCssResultObject: 'true' }),
	}
}

export const getUniqueParamsPerModule = ({
	deviceInfo,
	staticHTMLComponentUrl,
	qaMode,
	testMode,
	debugMode,
	isMasterPage = false,
}: {
	deviceInfo: ViewerModel['deviceInfo']
	staticHTMLComponentUrl: string
	testMode?: ViewerModel['mode']['enableTestApi']
	qaMode?: ViewerModel['mode']['qa']
	debugMode?: ViewerModel['mode']['debug']
	isMasterPage?: boolean
}) => {
	return matcher<Record<string, string>>({
		// @ts-ignore
		css: ({
			stylableMetadataURLs,
			ooiVersions,
			shouldRunVsm,
			shouldRunCssInBrowser,
			featuresToRun,
			featuresToIgnore,
			shouldGetCssResultObject,
		}) => {
			const shouldIncludeStylableMetadata =
				isMasterPage ||
				(featuresToIgnore?.length && !featuresToIgnore?.includes('stylableCss')) ||
				featuresToRun?.includes('stylableCss')

			return _.pickBy(
				{
					...getBaseCssParams(deviceInfo, shouldRunVsm, shouldRunCssInBrowser, shouldGetCssResultObject),
					...(ooiVersions && { ooiVersions }),
					...(featuresToRun && { featuresToRun }),
					...(featuresToIgnore && { featuresToIgnore }),
					...(shouldIncludeStylableMetadata && {
						stylableMetadataURLs: JSON.stringify(stylableMetadataURLs || []),
					}),
				},
				(__, key) => isMasterPage || !MAPPERS_ONLY_PARAMS.includes(key)
			)
		},
		cssMappers: ({
			ooiVersions,
			shouldRunVsm,
			shouldRunCssInBrowser,
			featuresToRun,
			featuresToIgnore,
			shouldGetCssResultObject,
		}) => {
			return {
				...getBaseCssParams(deviceInfo, shouldRunVsm, shouldRunCssInBrowser, shouldGetCssResultObject),
				...(ooiVersions && { ooiVersions }),
				...(featuresToRun && { featuresToRun }),
				...(featuresToIgnore && { featuresToIgnore }),
			}
		},
		features: ({
			languageResolutionMethod,
			isMultilingualEnabled,
			externalBaseUrl,
			useSandboxInHTMLComp,
			disableStaticPagesUrlHierarchy,
			aboveTheFoldSectionsNum,
			isTrackClicksAnalyticsEnabled,
			isSocialElementsBlocked,
		}) => {
			return {
				languageResolutionMethod,
				isMultilingualEnabled: isMultilingualEnabled ? `${isMultilingualEnabled}` : 'false',
				isTrackClicksAnalyticsEnabled: isTrackClicksAnalyticsEnabled
					? `${isTrackClicksAnalyticsEnabled}`
					: 'false',
				disableStaticPagesUrlHierarchy: disableStaticPagesUrlHierarchy
					? `${disableStaticPagesUrlHierarchy}`
					: 'false',
				useSandboxInHTMLComp: `${useSandboxInHTMLComp}`,
				externalBaseUrl,
				deviceType: deviceInfo.deviceClass,
				staticHTMLComponentUrl,
				...(aboveTheFoldSectionsNum && { aboveTheFoldSectionsNum }),
				...(testMode && { testMode: 'true' }),
				...(qaMode && { qaMode: 'true' }),
				...(debugMode && { debugMode: 'true' }),
				...(isSocialElementsBlocked && { isSocialElementsBlocked: 'true' }),
			}
		},
		platform: ({ externalBaseUrl }) => {
			return {
				staticHTMLComponentUrl,
				externalBaseUrl,
			}
		},
		siteMap: () => ({}),
		mobileAppBuilder: () => ({}),
		builderComponent: () => ({}),
	})
}

export const getCommonParams = (
	{
		rendererType,
		freemiumBanner,
		coBrandingBanner,
		dayfulBanner,
		mobileActionsMenu,
		viewMode,
		isWixSite,
		hasTPAWorkerOnSite,
		isResponsive,
		wixCodePageIds,
		isPremiumDomain,
		migratingToOoiWidgetIds,
		registryLibrariesTopology,
		language,
		originalLanguage,
		isInSeo,
		appDefinitionIdToSiteRevision,
		formFactor,
		editorName,
		builderWidgetsIds,
		isClientSdkOnSite,
	}: SiteScopeParams,
	{ errorPageId, pageCompId }: TBSiteAssetsRequest,
	beckyExperiments: Experiments,
	remoteWidgetStructureBuilderVersion: string,
	blocksBuilderManifestGeneratorVersion: string,
	anywhereThemeOverride?: string
) => {
	const isWixCodeOnPage = () =>
		`${
			// on responsive sites we do not fetch master page platform becky,
			// so we check for master page code in the single page request
			isResponsive
				? wixCodePageIds.includes('masterPage') || wixCodePageIds.includes(pageCompId)
				: wixCodePageIds.includes(pageCompId)
		}`

	const params = {
		rendererType,
		freemiumBanner: freemiumBanner ? `${freemiumBanner}` : undefined,
		coBrandingBanner: coBrandingBanner ? `${coBrandingBanner}` : undefined,
		dayfulBanner: dayfulBanner ? `${dayfulBanner}` : undefined,
		mobileActionsMenu: mobileActionsMenu ? `${mobileActionsMenu}` : undefined,
		isPremiumDomain: isPremiumDomain ? `${isPremiumDomain}` : undefined,
		isWixCodeOnPage: isWixCodeOnPage(),
		isWixCodeOnSite: `${wixCodePageIds.length > 0}`,
		isClientSdkOnSite,
		hasTPAWorkerOnSite: `${hasTPAWorkerOnSite}`,
		viewMode: viewMode || undefined,
		isWixSite: isWixSite ? `${isWixSite}` : undefined,
		errorPageId: errorPageId || undefined,
		isResponsive: isResponsive ? `${isResponsive}` : undefined,
		beckyExperiments: stringifyExperiments(beckyExperiments) || undefined,
		remoteWidgetStructureBuilderVersion,
		blocksBuilderManifestGeneratorVersion,
		migratingToOoiWidgetIds,
		registryLibrariesTopology:
			registryLibrariesTopology && registryLibrariesTopology.length
				? JSON.stringify(registryLibrariesTopology)
				: undefined,
		language,
		originalLanguage,
		isInSeo: isInSeo ? `${isInSeo}` : 'false',
		appDefinitionIdToSiteRevision: Object.keys(appDefinitionIdToSiteRevision).length
			? JSON.stringify(appDefinitionIdToSiteRevision)
			: undefined,
		builderWidgetsIds: Object.keys(builderWidgetsIds).length ? JSON.stringify(builderWidgetsIds) : undefined,
		anywhereThemeOverride,
		formFactor,
		editorName,
	}
	return Object.entries(params).reduce(
		(returnValue, [key, value]) => (value ? { ...returnValue, [key]: value } : returnValue),
		{}
	)
}

export function toSiteAssetsRequest(
	request: TBSiteAssetsRequest,
	modulesToHashes: ModulesToHashes,
	pageJsonFileNames: SitePagesModel['pageJsonFileNames'],
	siteScopeParams: SiteScopeParams,
	beckyExperiments: Experiments,
	staticHTMLComponentUrl: string,
	remoteWidgetStructureBuilderVersion: string,
	blocksBuilderManifestGeneratorVersion: string,
	deviceInfo: ViewerModel['deviceInfo'],
	qaMode?: boolean,
	testMode?: boolean,
	debugMode?: boolean,
	timeout?: number,
	fallbackStrategy?: FallbackStrategy,
	anywhereThemeOverride?: string,
	siteAssetsRouterUrls?: SiteAssetsRouterUrls,
	extendedTimeoutFlow?: boolean
) {
	const { moduleParams, pageCompId, pageJsonFileName, bypassSsrInternalCache } = request
	const { contentType, moduleName } = moduleParams

	const siteAssetsRouterUrl = siteScopeParams.isInSeo ? siteAssetsRouterUrls?.seo : siteAssetsRouterUrls?.users

	const maybeUrlOverride = bypassSsrInternalCache && siteAssetsRouterUrl ? siteAssetsRouterUrl : undefined

	const filteredBeckyExperiments = filterBeckyExperiments(beckyExperiments, moduleName)

	const isMasterPage = pageCompId === 'masterPage'

	const siteAssetsRequest: SiteAssetsRequest = {
		endpoint: {
			controller: 'pages',
			methodName: 'thunderbolt',
		},
		module: {
			name: moduleName,
			version: modulesToHashes[moduleName as SiteAssetsModuleName],
			fetchType: 'file',
			params: {
				...getCommonParams(
					siteScopeParams,
					request,
					filteredBeckyExperiments,
					remoteWidgetStructureBuilderVersion,
					blocksBuilderManifestGeneratorVersion,
					anywhereThemeOverride
				),
				...getUniqueParamsPerModule({
					deviceInfo,
					staticHTMLComponentUrl,
					qaMode,
					testMode,
					debugMode,
					isMasterPage,
				})(moduleParams),
			},
		},
		contentType,
		fallbackStrategy: fallbackStrategy || 'disable',
		pageJsonFileName: pageJsonFileName || pageJsonFileNames[pageCompId],
		pageId: pageCompId,
		...(siteScopeParams.disableSiteAssetsCache
			? { disableSiteAssetsCache: siteScopeParams.disableSiteAssetsCache }
			: {}),
		timeout,
		customRequestSource: siteScopeParams.isInSeo ? 'seo' : undefined,
		extendedTimeout: extendedTimeoutFlow,
		urlOverride: maybeUrlOverride,
		bypassSsrInternalCache,
	}

	return siteAssetsRequest
}
