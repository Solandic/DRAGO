import { CandidateRouteInfo } from './types'
import { decodeUriComponentIfEncoded } from '@wix/url-manager'

export {
	getRelativeEncodedUrl,
	getRelativeUrlData,
	createUrlHistoryManager,
	getRelativeUrl,
	decodeUriComponentIfEncoded,
} from '@wix/url-manager'

export const resolveQueryParams = (oldQueryParams: string, newQueryParams: string): string => {
	if (newQueryParams !== '') {
		const existingQueryParams = oldQueryParams ? oldQueryParams + '&' : oldQueryParams
		const mergedQueryParams = new URLSearchParams(existingQueryParams + newQueryParams)
		mergedQueryParams.forEach((val, key) => mergedQueryParams.set(key, val))
		return mergedQueryParams.toString()
	} else {
		return oldQueryParams
	}
}

export const removeProtocol = (url: string) => url.replace(/^https?:\/\//, '')

export const replaceProtocol = (url: string, protocol: string) => {
	const linkWithoutProtocol = url.startsWith('//')
	if (linkWithoutProtocol) {
		return `${protocol}${url}`
	}

	return url.replace(/^https?:/, protocol)
}

const createUrl = (pathOrUrl: string) => {
	const isRelativePath = pathOrUrl.startsWith('/')

	return isRelativePath ? new URL(pathOrUrl, window.location.origin) : new URL(pathOrUrl)
}

export const removeUrlHash = (url: string) => {
	const urlObj = createUrl(url)
	urlObj.hash = ''
	const queryParam = urlObj.search || ''
	if (urlObj.pathname === '/') {
		return `${urlObj.origin}${queryParam}`
	}

	return decodeUriComponentIfEncoded(urlObj.href)
}

export const removeQueryParams = (url: string) => {
	const urlObj = createUrl(url)
	urlObj.search = ''
	const hash = urlObj.hash || ''
	if (urlObj.pathname === '/') {
		return `${urlObj.origin}${hash}`
	}

	return decodeUriComponentIfEncoded(urlObj.href)
}
export const getUrlHash = (url: string) => {
	const urlObj = createUrl(url)
	const hash = urlObj.hash || ''
	return hash.replace('#', '')
}

export const convertHashBangUrlToSlashUrl = (url: string) => {
	const splitHashBang = url.split('#!')
	if (splitHashBang.length > 1) {
		const splitQueryParams = splitHashBang[0].split('?')
		const baseUrl = splitQueryParams[0]
		const queryParams = splitQueryParams[1] ? `?${splitQueryParams[1]}` : ''
		const maybeOtherPageUriSEO = splitHashBang[1].split('/')[0] || ''
		const baseUrlWithTrailingSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
		return `${baseUrlWithTrailingSlash}${maybeOtherPageUriSEO}${queryParams}`
	}

	return url
}

export const getContextByRouteInfo = ({ type, pageId, relativeEncodedUrl }: CandidateRouteInfo) => {
	// we use relativeEncodedUrl for support new line symbol, relevant for dynamic pages
	const [, additionalRoute] = relativeEncodedUrl.match(/\.\/.*?\/(.*$)/) || []
	return type === 'Dynamic' && additionalRoute ? `${pageId}_${additionalRoute}` : `${pageId}`
}

export const removeTrailingSlashAndQueryParams = (url: string) => url.replace(/\/?(\?.*)?$/, '')
