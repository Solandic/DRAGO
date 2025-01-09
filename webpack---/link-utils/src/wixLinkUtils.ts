import _ from 'lodash'
import type { LinkUtils, LinkUtilsConfig, Route } from './types'
import type {
	AnchorLinkData,
	DocumentLinkData,
	DynamicPageLinkData,
	EmailLinkData,
	ExternalLinkData,
	LinkData,
	LinkProps,
	PageLinkData,
	PhoneLinkData,
	TpaPageLinkData,
} from './linksTypes'
import { getBaseUrlFilesPath, getDocumentLink, resolveEmailLink, resolvePhoneLink } from './links'
import {
	isDocumentUrl,
	isPageUrl,
	isSamePageAnchorUrl,
	isScrollTopOrBottomAnchor,
	PAGE_URL_REGEXP,
} from './linkPatternUtils'
import { createExternalLinkUtils, getDocumentLinkProps, isAbsoluteLink } from './linkUtils'
import { createLinkUtils as createOldLinkUtils } from './oldLinkUtils'

type LinkTarget = LinkProps['target']
type LinkType = LinkProps['type']

const ANCHOR_NAME_TO_TYPE: Record<string, string> = {
	top: 'SCROLL_TO_TOP',
	bottom: 'SCROLL_TO_BOTTOM',
}

const isDynamicPage = (routersConfig: LinkUtilsConfig['routersConfig'], pageUriSeo: string) => {
	if (routersConfig) {
		const [prefix] = pageUriSeo.replace('#', '/#').split(/[/]+/)
		const routersWithPrefixFromUrl = Object.values(routersConfig).filter((router) => router.prefix === prefix)
		return routersWithPrefixFromUrl.length === 1
	}

	return false
}

const getRouteWithPossibleTpaInnerRoute = (routes: { [name: string]: Route }, relativePath: string) => {
	const decodedFullPathPageUriSeo = decodeURIComponent(relativePath)
	const fullPathPageRoute = `./${decodedFullPathPageUriSeo}`

	if (routes[fullPathPageRoute]) {
		return [decodedFullPathPageUriSeo, '']
	} else {
		const [pageUriSeo, ...tpaInnerRoute] = relativePath.split('/')
		const tpaInnerRoutePath = tpaInnerRoute.length > 0 ? `/${tpaInnerRoute.join('/')}` : ''
		return [pageUriSeo, tpaInnerRoutePath]
	}
}

const getPageRoute = (routingInfo: LinkUtilsConfig['routingInfo'], pageId: string): string => {
	const pageRoute = _.findKey(routingInfo.routes, (route) => {
		if (route.type === 'Dynamic') {
			const pageIds = route.pageIds || []
			return pageIds.includes(pageId)
		}

		return route.pageId === pageId
	})

	if (pageRoute) {
		return removeLeadingDotFromRoute(pageRoute)
	}

	throw new Error(`No url route for pageId: ${pageId}`)
}

const removeLeadingDotFromRoute = (url: string) => url.replace(/^\.\//, '/')

export const createLinkUtils = ({
	routingInfo,
	metaSiteId,
	userFileDomainUrl,
	popupPages,
	getCompIdByWixCodeNickname,
	getRoleForCompId,
	routersConfig,
	multilingualInfo,
	isMobileView,
	isPremiumDomain,
	experiments,
}: LinkUtilsConfig): LinkUtils => {
	const externalLinkUtils = createExternalLinkUtils({ metaSiteId, isMobileView })

	if (!experiments['specs.thunderbolt.splitLinkUtils']) {
		return createOldLinkUtils({
			routingInfo,
			metaSiteId,
			userFileDomainUrl,
			popupPages,
			getCompIdByWixCodeNickname,
			getRoleForCompId,
			routersConfig,
			multilingualInfo,
			isMobileView,
			isPremiumDomain,
			experiments,
		})
	}

	const BASE_DOCUMENTS_URL = `https://${metaSiteId}.${userFileDomainUrl}/`

	const isPopupId = (pageId: string) => (popupPages ? popupPages[pageId] : false)

	const isDocumentHref = (href: string) =>
		href.startsWith(BASE_DOCUMENTS_URL) ||
		(isPremiumDomain && href.startsWith(getBaseUrlFilesPath(routingInfo.externalBaseUrl).href))

	const removeBaseUrlFromHref = (href: string) => href.replace(routingInfo.externalBaseUrl, '')

	const parsePageUrl = (url: string) => {
		const [, relativePath = '', anchor = '', queryString = ''] = PAGE_URL_REGEXP.exec(url)!
		const relativePageUrlPrefix = relativePath.replace(/\/+$/, '')
		const queryParams = new URLSearchParams(queryString)
		if (
			!multilingualInfo?.isOriginalLanguage &&
			multilingualInfo?.currentLanguage?.resolutionMethod === 'QueryParam'
		) {
			queryParams.set('lang', multilingualInfo.currentLanguage.languageCode)
		}

		return { relativePageUrlPrefix, anchor, queryString: queryParams.toString() }
	}

	const isDynamicPageUrl = (url: string) => {
		const { relativePageUrlPrefix } = parsePageUrl(url)
		return isDynamicPage(routersConfig, relativePageUrlPrefix)
	}

	const getHomePageRouteWithPageUriSEO = () => {
		const mainPageRoute = _.findKey(routingInfo.routes, (route) => route.pageId === routingInfo.mainPageId)!
		return removeLeadingDotFromRoute(mainPageRoute)
	}

	const getPageLinkProps = (pageUrl: string, target: LinkTarget = '_self', rel?: LinkProps['rel']) => {
		const { relativePageUrlPrefix = '', anchor = '', queryString } = parsePageUrl(pageUrl)
		const anchorNickname = ANCHOR_NAME_TO_TYPE[anchor] || anchor

		if (isPopupId(relativePageUrlPrefix)) {
			return {
				type: 'PageLink' as LinkType,
				href: '',
				target: '_self' as LinkTarget,
				linkPopupId: relativePageUrlPrefix,
			}
		}
		const externalBaseUrl = routingInfo.externalBaseUrl

		let type: LinkType
		let href
		let isSamePageNavigation
		if (isDynamicPage(routersConfig, relativePageUrlPrefix)) {
			const relativeHref = `./${relativePageUrlPrefix}`
			isSamePageNavigation = relativeHref === routingInfo.relativeUrl
			type = 'DynamicPageLink'
			href = `${externalBaseUrl}/${relativePageUrlPrefix}`
		} else {
			const [pageUriSeoPath, maybeTpaInnerPath] = getRouteWithPossibleTpaInnerRoute(
				routingInfo.routes,
				relativePageUrlPrefix
			)

			const pageUriSeoInCurrentLang = routingInfo.pagesUriSEOs[pageUriSeoPath] || pageUriSeoPath

			const pageRoute = `./${pageUriSeoInCurrentLang}`
			const nextRouteConfig =
				pageRoute === './' ? { pageId: routingInfo.mainPageId } : routingInfo.routes[pageRoute]
			const isHomePageNavigation = nextRouteConfig?.pageId === routingInfo.mainPageId

			type = 'PageLink'
			href =
				isHomePageNavigation && !maybeTpaInnerPath
					? externalBaseUrl
					: `${externalBaseUrl}/${pageUriSeoInCurrentLang}${maybeTpaInnerPath}`

			isSamePageNavigation = nextRouteConfig && nextRouteConfig.pageId === routingInfo.pageId
		}

		const anchorCompId = anchorNickname && getCompIdByWixCodeNickname && getCompIdByWixCodeNickname(anchorNickname)
		const hasAnchorOnSamePage = isSamePageNavigation && anchorCompId
		const hasAnchorOnOtherPage = anchorNickname && !hasAnchorOnSamePage

		return {
			href: `${href}${queryString ? `?${new URLSearchParams(queryString).toString()}` : ''}`,
			target,
			rel,
			type,
			// if we have an anchor on the current page, we set the anchor compId
			...(hasAnchorOnSamePage && { anchorCompId }),
			// if we have an anchor on another page, we set the anchor data item Id
			...(hasAnchorOnOtherPage && { anchorDataId: anchorNickname }),
		}
	}

	const encodeInnerRoute = (innerRoute: string) => {
		const [innerRoutePath, stateQueryParams] = innerRoute.split('?')
		if (stateQueryParams) {
			const encodedQueryParams = encodeURIComponent(`?${stateQueryParams}`)
			return innerRoutePath ? `${innerRoutePath}${encodedQueryParams}` : encodedQueryParams
		}
		return innerRoutePath
	}

	const linkTypeToUrlResolverFn: Record<string, <T extends LinkData>(linkData: T) => string> = {
		AnchorLink: (linkData) => {
			const { anchorDataId, pageId } = linkData as AnchorLinkData
			const isScrollTopOrBottom = isScrollTopOrBottomAnchor(anchorDataId)
			const nextPageId = isScrollTopOrBottom ? routingInfo.pageId : pageId.replace(/^#/, '')
			const nextAnchorDataId = anchorDataId.startsWith('#') ? anchorDataId : `#${anchorDataId}`

			// get page route for current page id for top/bottom anchors, otherwise get route for pageId from data item
			const pageRoute = getPageRoute(routingInfo, nextPageId)
			return `${pageRoute}${nextAnchorDataId}`
		},
		DocumentLink: (linkData) => {
			const { docId, name } = linkData as DocumentLinkData
			return getDocumentLink(docId, name)
		},
		ExternalLink: (linkData) => {
			const { url } = linkData as ExternalLinkData
			return url
		},
		DynamicPageLink: (linkData) => {
			const { routerId, innerRoute, anchorDataId = '' } = linkData as DynamicPageLinkData
			const prefix = `/${routersConfig![routerId].prefix}`

			// query params passed in the innerRoute should be encoded as a path to properly apply them to the section after navigation
			const encodedInnerRoute = innerRoute ? encodeInnerRoute(innerRoute) : innerRoute
			const suffix = encodedInnerRoute ? `/${encodedInnerRoute}${anchorDataId}` : anchorDataId
			return `${prefix}${suffix}`
		},
		TpaPageLink: (linkData) => {
			const { pageId, path = '' } = linkData as TpaPageLinkData
			const _pageId = pageId.replace(/^#/, '')
			const prefix = routingInfo.pageIdToPrefix[_pageId]
			const pageUriSeo = routingInfo.pages[_pageId].pageUriSEO
			const relativeUrl = prefix ? `/${prefix}/${pageUriSeo}` : `/${pageUriSeo}`
			const encodedPath = encodeInnerRoute(path)
			const isPathWithPageUriSEO = path.startsWith(relativeUrl)
			if (isPathWithPageUriSEO) {
				return encodedPath
			}

			const suffix = encodedPath ? `/${encodedPath}` : ''
			return `${relativeUrl}${suffix}`
		},
		PageLink: (linkData) => {
			const { pageId: pageIdOrData } = linkData as PageLinkData
			const pageId = ((typeof pageIdOrData === 'string' ? pageIdOrData : pageIdOrData.id) || '').replace(/^#/, '')
			if (isPopupId(pageId)) {
				return `/${pageId}`
			}

			if (pageId === routingInfo.mainPageId) {
				return '/'
			}

			return getPageRoute(routingInfo, pageId)
		},
		PhoneLink: (linkData) => resolvePhoneLink(linkData as PhoneLinkData),
		EmailLink: (linkData) => resolveEmailLink(linkData as EmailLinkData),
	}

	return {
		isDynamicPage: isDynamicPageUrl,
		isAbsoluteUrl: externalLinkUtils.isAbsoluteUrl,
		getImpliedLink: externalLinkUtils.getImpliedLink,
		getImpliedLinks: externalLinkUtils.getImpliedLinks,
		getLink: ({
			href: linkHref = '',
			linkPopupId,
			anchorCompId = '',
			anchorDataId = '',
			docInfo,
			type,
		}: LinkProps = {}) => {
			if (linkPopupId) {
				return `/${linkPopupId}`
			}

			if (isDocumentHref(linkHref)) {
				return getDocumentLink(docInfo!.docId, docInfo!.name)
			}

			const linkProps: LinkProps = { href: linkHref, linkPopupId, anchorDataId, docInfo, type }
			if (isAbsoluteLink(metaSiteId, linkProps)) {
				return externalLinkUtils.getLink(linkProps)
			}

			// remove query params if exist
			const [href] = linkHref.split('?')
			const anchor = getRoleForCompId?.(anchorCompId, 'wixCode') || anchorDataId
			const anchorId = anchor ? `#${anchor}` : ''
			const isHomePageUrl = href === routingInfo.externalBaseUrl
			const link = isHomePageUrl ? getHomePageRouteWithPageUriSEO() : removeBaseUrlFromHref(href)

			return `${link}${anchorId}`
		},
		getLinkProps: (url, target, rel) => {
			if (isSamePageAnchorUrl(url)) {
				const relativeUrl = removeLeadingDotFromRoute(routingInfo.relativeUrl)
				const currentPageUriSEOWithAnchorUrl = `${relativeUrl}${url}`
				return getPageLinkProps(currentPageUriSEOWithAnchorUrl, target)
			}

			if (isPageUrl(url)) {
				return getPageLinkProps(url, target, rel)
			}

			if (isDocumentUrl(url)) {
				return getDocumentLinkProps(
					url,
					metaSiteId,
					userFileDomainUrl,
					routingInfo.externalBaseUrl,
					isPremiumDomain
				)
			}

			return externalLinkUtils.getLinkProps(url, target, rel)
		},
		getLinkUrlFromDataItem: <T extends LinkData>(linkData: T) => {
			const linkUrlResolverFn = linkTypeToUrlResolverFn[linkData.type]
			if (linkUrlResolverFn) {
				return linkUrlResolverFn(linkData)
			}

			throw new Error('Provided link type is not supported')
		},
	}
}

export const isLinkProps = (linkProps: any): linkProps is LinkProps =>
	!linkProps.id && !!(linkProps.href || linkProps.linkPopupId || linkProps.anchorDataId || linkProps.anchorCompId)
