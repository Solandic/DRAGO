import type { LinkUtils, LinkUtilsConfig } from './types'
import type { LinkProps } from './linksTypes'
import {
	GetImpliedLinksConfig,
	getImpliedLink,
	getImpliedLinks,
	getDocumentLink,
	resolveEmailLink,
	resolvePhoneLink,
	resolveDocumentLink,
} from './links'
import {
	isAbsoluteUrl,
	isDocumentUrl,
	isMailtoUrl,
	isPhoneUrl,
	DOCUMENT_URL_REGEXP,
	LEGACY_DOCUMENT_URL_REGEXP,
	MAILTO_URL_REGEXP,
	PHONE_URL_REGEXP,
	isScrollTopOrBottomAnchor,
} from './linkPatternUtils'
import _ from 'lodash'

const ANCHOR_NAME_TO_TYPE: Record<string, string> = {
	top: 'SCROLL_TO_TOP',
	bottom: 'SCROLL_TO_BOTTOM',
}

const getEscapedQueries = (queryParams: URLSearchParams) => ({
	subject: encodeURIComponent(queryParams.get('subject') || ''),
	body: encodeURIComponent(queryParams.get('body') || ''),
	bcc: encodeURIComponent(queryParams.get('bcc') || ''),
	cc: encodeURIComponent(queryParams.get('cc') || ''),
})

const getMailtoLinkProps = (mailtoUrl: string): LinkProps => {
	const [, recipient, queries] = MAILTO_URL_REGEXP.exec(mailtoUrl)!
	const escapedQuery = getEscapedQueries(new URLSearchParams(queries))

	return {
		type: 'EmailLink',
		href: resolveEmailLink({ recipient, ...escapedQuery }),
		target: '_self',
	}
}
const getPhoneLinkProps = (telUrl: string): LinkProps => {
	const [, phoneNumber] = PHONE_URL_REGEXP.exec(telUrl)!
	return {
		type: 'PhoneLink',
		href: resolvePhoneLink({ phoneNumber }),
		target: '_self',
	}
}
const getExternalLinkProps = (
	url: string,
	target: LinkProps['target'] = '_blank',
	rel: LinkProps['rel'] = 'noopener'
): LinkProps => {
	return {
		type: 'ExternalLink',
		href: url,
		target,
		rel,
	}
}
export const getDocumentLinkProps = (
	documentUrl: string,
	metaSiteId: string,
	userFileDomainUrl: string = 'filesusr.com/',
	externalBaseUrl: string = '',
	isPremiumDomain: boolean = false
): LinkProps => {
	const [, docId, name] = DOCUMENT_URL_REGEXP.exec(documentUrl) || LEGACY_DOCUMENT_URL_REGEXP.exec(documentUrl)!

	return {
		type: 'DocumentLink',
		href: resolveDocumentLink(
			{ docId, name: name || '', indexable: false },
			metaSiteId,
			userFileDomainUrl,
			externalBaseUrl,
			isPremiumDomain
		),
		target: '_blank',
		docInfo: {
			docId,
			name,
		},
	}
}

class UnsupportedLinkTypeError extends Error {
	constructor() {
		super('Unsupported link type')
		this.name = 'UnsupportedLinkTypeError'

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UnsupportedLinkTypeError)
		}
	}
}

export const createExternalLinkUtils = ({
	metaSiteId = 'unknown',
	isMobileView = false,
}: Partial<LinkUtilsConfig>): LinkUtils => {
	const BASE_DOCUMENTS_URL = `https://${metaSiteId}.filesusr.com/`

	const isDocumentHref = (href: string) => href.startsWith(BASE_DOCUMENTS_URL)

	return {
		isDynamicPage: (): boolean => {
			return false
		},
		isAbsoluteUrl,
		getImpliedLink: (text: string) => getImpliedLink(text, isMobileView),
		getImpliedLinks: (text: string, config?: GetImpliedLinksConfig) => getImpliedLinks(text, isMobileView, config),
		getLink: ({ href = '', anchorDataId = '', docInfo, type }: LinkProps = {}) => {
			if (isMailtoUrl(href)) {
				return href
			}

			if (isDocumentHref(href)) {
				return getDocumentLink(docInfo!.docId, docInfo!.name)
			}

			if (isScrollTopOrBottomAnchor(anchorDataId)) {
				return `#${_.invert(ANCHOR_NAME_TO_TYPE)[anchorDataId]}`
			}

			const isExternalLink = type === 'ExternalLink'
			if (isExternalLink) {
				return href
			}

			return href
		},
		getLinkProps: (url, target, rel) => {
			if (isMailtoUrl(url)) {
				return getMailtoLinkProps(url)
			}

			if (isPhoneUrl(url)) {
				return getPhoneLinkProps(url)
			}

			if (isAbsoluteUrl(url)) {
				return getExternalLinkProps(url, target, rel)
			}

			if (isDocumentUrl(url)) {
				return getDocumentLinkProps(url, metaSiteId)
			}

			throw new UnsupportedLinkTypeError()
		},
		getLinkUrlFromDataItem: () => {
			throw new Error(`getLinkUrlFromDataItem is not implemented`)
		},
	}
}

export const isAbsoluteLink = (metaSiteId: string, { href = '', anchorDataId = '', type }: LinkProps): boolean => {
	return (
		isMailtoUrl(href) ||
		type === 'ExternalLink' ||
		href.startsWith(`https://${metaSiteId}.filesusr.com/`) ||
		isScrollTopOrBottomAnchor(anchorDataId)
	)
}
