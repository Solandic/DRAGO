import { ModifyUrlChangeListeners, NavigationParams } from '@wix/thunderbolt-symbols'
import type { IUrlHistoryState } from '@wix/thunderbolt-symbols'
import { getRelativeEncodedUrl, getRelativeUrl } from './utils'
import { UrlManagerFactoryApi, UrlManagerParams } from './types'

export const createUrlHistoryManager = ({
	browserWindow,
	onUrlChangeListeners,
	requestUrl,
	externalBaseUrl,
	currentRouteInfo,
	logger,
}: UrlManagerParams): UrlManagerFactoryApi => {
	const state: { previousPageId?: string } = {}
	let urlChangeListeners = [...onUrlChangeListeners]
	const getCurrentUrl = (): string => browserWindow?.location.href || requestUrl
	const getRelativeUrlInternal = () => getRelativeUrl(getCurrentUrl(), externalBaseUrl)
	const getFullUrlWithoutQueryParams = () => {
		const relativeUrl = getRelativeUrlInternal()
		const isHomePageUrl = relativeUrl === './'
		const replaceStr = isHomePageUrl ? externalBaseUrl : `${externalBaseUrl}/`

		return relativeUrl.replace('./', replaceStr)
	}
	const pushUrl = (
		parsedUrl: URL,
		{ disableScrollToTop, skipHistory }: Omit<NavigationParams, 'anchorDataId'> = {}
	) => {
		if (!browserWindow || !browserWindow.history) {
			return
		}
		const url = parsedUrl.toString()

		const currentUrl = new URL(browserWindow.location.href)
		parsedUrl.searchParams.sort()
		currentUrl.searchParams.sort()

		const historyState: IUrlHistoryState = { scrollY: browserWindow.scrollY }
		if (skipHistory) {
			browserWindow.history.replaceState(historyState, '', url)
		}

		if (currentUrl.toString() === parsedUrl.toString()) {
			return
		}

		if (!skipHistory) {
			browserWindow.history.replaceState(historyState, '', currentUrl.toString())
			try {
				const data = disableScrollToTop ? { scrollY: historyState?.scrollY } : null
				browserWindow.history.pushState(data, '', url)
			} catch (ex) {
				logger.captureError(ex, { tags: { feature: 'feature-router', pushStateError: true } })
			}
		}

		const currentPageId = currentRouteInfo.getCurrentRouteInfo()?.pageId

		if (state.previousPageId === currentPageId) {
			urlChangeListeners.forEach((listener) => listener.onUrlChange(new URL(url)))
		}
	}

	const addOnUrlChangeListener: ModifyUrlChangeListeners = (listenerToAdd) => urlChangeListeners.push(listenerToAdd)
	const removeOnUrlChangeListener: ModifyUrlChangeListeners = (listenerToRemove) =>
		(urlChangeListeners = urlChangeListeners.filter((listener) => listener !== listenerToRemove))

	const api = {
		getHistoryState: () => {
			if (!browserWindow || !browserWindow.history) {
				return null
			}
			return browserWindow.history.state as IUrlHistoryState
		},

		updateHistoryState: (newHistory?: IUrlHistoryState) => {
			if (!browserWindow || !browserWindow.history) {
				return
			}

			if (newHistory) {
				const currentUrl = new URL(browserWindow.location.href)
				currentUrl.searchParams.sort()

				browserWindow.history.replaceState(newHistory, '', currentUrl.toString())
			}

			return
		},

		getParsedUrl: () => new URL(getCurrentUrl()),

		getFullUrlWithoutQueryParams,

		getRelativeUrl: getRelativeUrlInternal,

		getRelativeEncodedUrl: () => getRelativeEncodedUrl(getCurrentUrl(), externalBaseUrl),
	}

	const updateState = (pageId: string) => {
		state.previousPageId = pageId
	}

	return { api, addOnUrlChangeListener, removeOnUrlChangeListener, pushUrl, getCurrentUrl, updateState }
}
