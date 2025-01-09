import { Experiments } from '@wix/thunderbolt-symbols'
import type { IRoutingConfig, Route, CandidateRouteInfo } from './types'
import { queryParamsWhitelist as defaultQueryParamsWhitelist, overrideSuffix } from '@wix/thunderbolt-commons'
import {
	resolveQueryParams,
	removeProtocol,
	replaceProtocol,
	getRelativeUrlData,
	decodeUriComponentIfEncoded,
	convertHashBangUrlToSlashUrl,
} from './urlUtils'
import { UrlResolvingOptions } from './types'

const removeWww = (url: string) => url.replace('www.', '')

const isInternalUrl = (url: string, baseUrl: string): boolean => {
	const parsedUrl = new URL(removeWww(url), `${baseUrl}/`)
	const parsedBaseUrl = new URL(removeWww(baseUrl))
	return parsedUrl.host === parsedBaseUrl.host && parsedUrl.pathname.startsWith(parsedBaseUrl.pathname)
}

const getRouteData = (
	relativePathnameParts: Array<string>,
	routes: IRoutingConfig['routes'],
	partialRouteMatchingAllowed: boolean,
	experiments?: Experiments,
	tpaSectionPageIds?: Record<string, boolean>
): (Route & { isPartialStaticRouteMatch?: boolean }) | undefined => {
	const decodedRelativePathnameParts = relativePathnameParts.map(decodeUriComponentIfEncoded)
	const routeKey = `./${decodedRelativePathnameParts.join('/')}`

	if (routes[routeKey]) {
		return routes[routeKey]
	}

	const dynamicPageRouteKey = `./${decodedRelativePathnameParts[0]}`
	const fixPartialRoute404Experiment =
		experiments && experiments['specs.thunderbolt.fixPartialRouteMatchNotFoundPages']
	const isFixPartialRoute404ExperimentOn =
		typeof fixPartialRoute404Experiment === 'string'
			? fixPartialRoute404Experiment === 'true'
			: fixPartialRoute404Experiment
	if (
		isFixPartialRoute404ExperimentOn &&
		routes[dynamicPageRouteKey]?.type === 'Static' &&
		!tpaSectionPageIds?.[routes[dynamicPageRouteKey].pageId || ''] &&
		!partialRouteMatchingAllowed
	) {
		return {
			...routes[dynamicPageRouteKey],
			isPartialStaticRouteMatch: true,
		}
	}

	return routes[dynamicPageRouteKey]
}

export const keepInternalQueryParamsOnly = (
	searchParams: URLSearchParams,
	queryParamsWhitelist: Set<string> = defaultQueryParamsWhitelist
) => {
	// @ts-ignore - ts thinks there's no entries() on searchParams, but it's there.
	const entries = searchParams.entries()
	const filteredEntries = [...entries].filter(
		([key]) => queryParamsWhitelist.has(key) || key.endsWith(overrideSuffix)
	)
	return new URLSearchParams(filteredEntries).toString()
}

const isUrlOnSameWixSite = (candidateUrl: string, baseUrl: string) => {
	const candidateUrlWithNoProtocol = removeProtocol(candidateUrl)
	const baseUrlWithNoProtocol = removeProtocol(baseUrl)

	return candidateUrlWithNoProtocol.startsWith(baseUrlWithNoProtocol)
}

const fixSameWixSiteCandidateUrl = (candidateUrl: string, siteProtocol: string) => {
	const candidateSlashUrl = convertHashBangUrlToSlashUrl(candidateUrl)
	return replaceProtocol(candidateSlashUrl, siteProtocol)
}

export const resolveUrl = (
	url: string,
	routingConfig: IRoutingConfig,
	options?: UrlResolvingOptions,
	experiments?: Experiments,
	tpaSectionPageIds?: Record<string, boolean>
): Partial<CandidateRouteInfo> => {
	const { currentParsedUrl, queryParamsWhitelist = defaultQueryParamsWhitelist } = options || {}
	const isHomePageUrl = url === routingConfig.baseUrl
	const queryParams = currentParsedUrl
		? keepInternalQueryParamsOnly(currentParsedUrl.searchParams, queryParamsWhitelist)
		: ''

	// should resolve to base url on home page url, otherwise we get extra slash on navigation
	const candidateUrl = isHomePageUrl ? routingConfig.baseUrl : url
	const urlToParse = isUrlOnSameWixSite(candidateUrl, routingConfig.baseUrl)
		? fixSameWixSiteCandidateUrl(candidateUrl, new URL(routingConfig.baseUrl).protocol)
		: candidateUrl

	const parsedUrl = new URL(urlToParse, `${routingConfig.baseUrl}/`)
	parsedUrl.search = resolveQueryParams(parsedUrl.search, queryParams)

	if (!isInternalUrl(urlToParse, routingConfig.baseUrl)) {
		return {
			parsedUrl,
		}
	}

	const { relativeUrl, relativeEncodedUrl, relativePathnameParts } = getRelativeUrlData(
		urlToParse,
		routingConfig.baseUrl
	)
	const route = getRouteData(
		relativePathnameParts,
		routingConfig.routes,
		routingConfig.partialRouteMatchingAllowed || false,
		experiments,
		tpaSectionPageIds
	)

	return {
		...route,
		relativeUrl,
		relativeEncodedUrl,
		parsedUrl,
	}
}
