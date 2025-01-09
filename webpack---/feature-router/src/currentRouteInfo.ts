import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	DynamicRouteData,
	SiteFeatureConfigSymbol,
	FeatureExportsSymbol,
	AppDidMountPromiseSymbol,
} from '@wix/thunderbolt-symbols'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'
import { getRelativeUrl } from './urlUtils'
import type { ICurrentRouteInfo, IRoutingConfig, CandidateRouteInfo } from './types'
import { name } from './symbols'

const currentRouteInfo = (
	routingConfig: IRoutingConfig,
	routerExports: IFeatureExportsStore<typeof name>,
	appDidMountPromise: Promise<unknown>
): ICurrentRouteInfo => {
	let routeInfo: CandidateRouteInfo
	let prevRouteInfo: CandidateRouteInfo | null = null
	let wantedRouteInfo: Partial<CandidateRouteInfo> | null = null
	let didLandOnProtectedPage = false

	const isLandingOnProtectedPage = () => !routeInfo

	// We need to set this flag once the app is mounted so we know if the first page will be from ssr or not
	appDidMountPromise.then(() => (didLandOnProtectedPage = isLandingOnProtectedPage()))
	const onRouterInitDoneCallbacks: Array<() => void> = []

	return {
		getCurrentRouteInfo: () => {
			return routeInfo ? routeInfo : null
		},
		getPreviousRouterInfo: () => {
			return prevRouteInfo
		},
		getWantedRouteInfo: () => {
			return wantedRouteInfo
		},
		updateCurrentRouteInfo: (nextRouteInfo: CandidateRouteInfo) => {
			// Checking if we do not have routeinfo yet - which means we are in init phase
			const shouldTriggerRouterInitDone: boolean = typeof routeInfo === 'undefined'
			prevRouteInfo = routeInfo
			routeInfo = nextRouteInfo
			wantedRouteInfo = null

			routerExports.export({ pageId: nextRouteInfo.pageId })

			// Router init callbacks
			if (shouldTriggerRouterInitDone) {
				onRouterInitDoneCallbacks.forEach((callback) => callback())
			}
		},
		updateWantedRouteInfo: (candidateRouteInfo: Partial<CandidateRouteInfo>) => {
			wantedRouteInfo = candidateRouteInfo
		},
		updateRouteInfoUrl: (parsedUrl: URL) => {
			if (routeInfo) {
				routeInfo.parsedUrl = parsedUrl
				routeInfo.relativeUrl = getRelativeUrl(parsedUrl.href, routingConfig.baseUrl)
			}
		},
		updateCurrentDynamicRouteInfo: (dynamicRouteData: DynamicRouteData) => {
			routeInfo = { ...routeInfo, dynamicRouteData }
		},
		isLandingOnProtectedPage,
		getCurrentUrlWithoutQueryParams: () => {
			if (!routeInfo) {
				return null
			}

			return `${routeInfo.parsedUrl.origin}${routeInfo.parsedUrl.pathname}`
		},
		onRouterInitDone: (callback: () => void) => {
			onRouterInitDoneCallbacks.push(callback)
		},
		didLandOnProtectedPage: () => didLandOnProtectedPage,
	}
}

export const CurrentRouteInfo = withDependencies(
	[named(SiteFeatureConfigSymbol, name), named(FeatureExportsSymbol, name), AppDidMountPromiseSymbol],
	currentRouteInfo
)
