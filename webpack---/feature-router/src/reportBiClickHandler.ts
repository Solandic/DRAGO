import { withDependencies } from '@wix/thunderbolt-ioc'
import { BusinessLogger, BusinessLoggerSymbol, ILinkClickHandler } from '@wix/thunderbolt-symbols'

// eslint-disable-next-line @wix/thunderbolt/no-internal-import
import { isMailtoUrl, isPhoneUrl, isWhatsappLink } from '@wix/thunderbolt-commons/src/platform/linkPatternUtils'
import { UrlHistoryManagerSymbol } from './symbols'
import type { IUrlHistoryManager } from './types'

export const ReportBiClickHandlerFactory = (
	businessLogger: BusinessLogger,
	urlHistoryManager: IUrlHistoryManager
): ILinkClickHandler => {
	const sendBi = (clickType: string, value: string, currentUrl: string, evid: number = 1112, extraParams?: any) => {
		businessLogger.logger.log(
			{
				src: 76,
				evid,
				clickType,
				value,
				url: currentUrl,
				...extraParams,
			},
			{ endpoint: 'pa' }
		)
	}
	return {
		handlerId: 'reportBi',
		handleClick: (anchorTarget: HTMLElement) => {
			const href = anchorTarget.getAttribute('href') || ''
			const currentUrl = urlHistoryManager.getFullUrlWithoutQueryParams()
			if (isPhoneUrl(href)) {
				sendBi('phone-clicked', href, currentUrl)
			}
			if (isMailtoUrl(href)) {
				sendBi('email-clicked', href, currentUrl)
			}
			if (isWhatsappLink(href)) {
				sendBi('whatsapp-clicked', href, currentUrl)
			}
			if (anchorTarget.classList.contains('wixui-rich-text__text')) {
				const params = {
					element_id: anchorTarget.offsetParent?.id || '',
					url: anchorTarget.baseURI,
					elementGroup: 'element_group_button',
					elementTitle: anchorTarget.innerText,
					actionName: null,
					details: null,
					elementType: 'element_type_val_link',
					value: href,
				}

				sendBi('web-link-clicked', href, currentUrl, 1113, params)
			}
			return false
		},
	}
}

export const ReportBiClickHandler = withDependencies(
	[BusinessLoggerSymbol, UrlHistoryManagerSymbol],
	ReportBiClickHandlerFactory
)
