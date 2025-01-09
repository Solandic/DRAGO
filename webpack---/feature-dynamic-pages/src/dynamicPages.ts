import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	DynamicPagesAPI,
	ICurrentRouteInfo,
	IRoutingMiddleware,
	IUrlHistoryManager,
	UrlHistoryManagerSymbol,
} from 'feature-router'
import {
	Fetch,
	IFetchApi,
	SiteFeatureConfigSymbol,
	CurrentRouteInfoSymbol,
	BrowserWindow,
	BrowserWindowSymbol,
	ExperimentsSymbol,
	Experiments,
	LoggerSymbol,
	ILogger,
} from '@wix/thunderbolt-symbols'
import type {
	DynamicPagesSiteConfig,
	IDynamicPagesResponseHandler,
	IDynamicPagesWarmupData,
	IPermissionsHandlerProvider,
} from './types'
import { DynamicPagesResponseHandlerSymbol, name, PermissionsHandlerProviderSymbol } from './symbols'
import { errorPagesIds, getRouterPrefix, getRouterSuffix } from './utils'
import { IWarmupDataProvider, WarmupDataProviderSymbol } from 'feature-warmup-data'
import { RouterFetchSymbol, RouterFetchAPI, RouterFetchRequestTypes } from 'feature-router-fetch'

export const DynamicPages = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		BrowserWindowSymbol,
		Fetch,
		UrlHistoryManagerSymbol,
		DynamicPagesResponseHandlerSymbol,
		PermissionsHandlerProviderSymbol,
		CurrentRouteInfoSymbol,
		WarmupDataProviderSymbol,
		RouterFetchSymbol,
		ExperimentsSymbol,
		LoggerSymbol,
	],
	(
		{ prefixToRouterFetchData, routerPagesSeoToIdMap }: DynamicPagesSiteConfig,
		browserWindow: BrowserWindow,
		fetchApi: IFetchApi,
		urlHistoryManager: IUrlHistoryManager,
		{ handleResponse }: IDynamicPagesResponseHandler,
		permissionsHandlerProvider: IPermissionsHandlerProvider,
		currentRouteInfo: ICurrentRouteInfo,
		warmupDataProvider: IWarmupDataProvider,
		{ getFetchParams, tryToGetCachableFetchParams }: RouterFetchAPI,
		experiments: Experiments,
		logger: ILogger
	): IRoutingMiddleware & DynamicPagesAPI => {
		const getWarmupDynamicRouteInfo = () => {
			const currentRoute = currentRouteInfo.getCurrentRouteInfo()
			if (!experiments['specs.thunderbolt.dynamicPagesWarmupData2'] || currentRoute) {
				return null
			}

			// we don't want to wait for it, only use it if we already have it (i.e. documentReady)
			return warmupDataProvider.getWarmupData<IDynamicPagesWarmupData>(name, { timeout: 0 })
		}

		return {
			getSitemapFetchParams(routerPrefix) {
				const routerFetchData = prefixToRouterFetchData[routerPrefix]
				if (!routerFetchData) {
					return null
				}

				const relativeEncodedUrl = urlHistoryManager.getRelativeEncodedUrl()
				const queryParams = urlHistoryManager.getParsedUrl().search
				const routerSuffix = getRouterSuffix(relativeEncodedUrl)
				return getFetchParams(RouterFetchRequestTypes.SITEMAP, routerFetchData, { routerSuffix, queryParams })
			},
			async handle(routeInfo, dynamicPageIdOverride) {
				if (!routeInfo.pageId && routeInfo.relativeUrl && routeInfo.parsedUrl && routeInfo.relativeEncodedUrl) {
					const routerPrefix = getRouterPrefix(routeInfo.relativeUrl)
					const routerFetchData = prefixToRouterFetchData[routerPrefix]

					if (!routerFetchData) {
						if (routerPagesSeoToIdMap[routerPrefix]) {
							return {
								...routeInfo,
								pageId: errorPagesIds.NOT_FOUND,
							}
						}
						return routeInfo
					}

					const warmupDynamicRouteInfo = await getWarmupDynamicRouteInfo()
					if (warmupDynamicRouteInfo) {
						return {
							...routeInfo,
							...warmupDynamicRouteInfo,
						}
					}

					logger.interactionStarted('custom_router_fetch_route_info')
					const routerSuffix = getRouterSuffix(routeInfo.relativeEncodedUrl)
					const queryParams = routeInfo.parsedUrl.search
					const { url, options } = await tryToGetCachableFetchParams(
						RouterFetchRequestTypes.PAGES,
						routerFetchData,
						{
							routerSuffix,
							queryParams,
							dynamicPageIdOverride,
						}
					)

					const routeInfoFromResponsePromise = handleResponse(fetchApi.envFetch(url, options), routeInfo)
					return permissionsHandlerProvider
						.getHandler()
						.handle(routeInfoFromResponsePromise, routeInfo)
						.then((candidateRouteInfo) => {
							logger.interactionEnded('custom_router_fetch_route_info')
							return candidateRouteInfo
						})
				}

				return routeInfo
			},
		}
	}
)
