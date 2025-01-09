import { withDependencies, multi, named } from '@wix/thunderbolt-ioc'
import { name, PopHistoryStateHandler, UrlChangeHandlerForPage } from './symbols'
import {
	IAppWillMountHandler,
	CurrentRouteInfoSymbol,
	BrowserWindowSymbol,
	BrowserWindow,
	ViewerModelSym,
	ViewerModel,
	SamePageUrlChangeListenerSymbol,
	ISamePageUrlChangeListener,
	IAppWillLoadPageHandler,
	MasterPageFeatureConfigSymbol,
	ILogger,
	LoggerSymbol,
	FeatureExportsSymbol,
	NavigationParams,
} from '@wix/thunderbolt-symbols'
import { IPageProvider, PageProviderSymbol } from 'feature-pages'
import type {
	IUrlHistoryPopStateHandler,
	IUrlHistoryManager,
	IUrlChangeHandler,
	ICurrentRouteInfo,
	RouterMasterPageConfig,
} from './types'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'
import { createUrlHistoryManager } from '@wix/url-manager'

export const UrlChangeListener = withDependencies(
	[PageProviderSymbol, CurrentRouteInfoSymbol],
	(pageProvider: IPageProvider, currentRouteInfo: ICurrentRouteInfo): ISamePageUrlChangeListener => {
		return {
			onUrlChange: async (url) => {
				const routeInfo = currentRouteInfo.getCurrentRouteInfo()
				if (routeInfo) {
					currentRouteInfo.updateRouteInfoUrl(url)
					const { contextId, pageId } = routeInfo
					const page = await pageProvider(contextId, pageId)
					const pageHandlers = page.getAllImplementersOf<IUrlChangeHandler>(UrlChangeHandlerForPage)
					return Promise.all(pageHandlers.map((handler) => handler.onUrlChange(url)))
				}
			},
		}
	}
)

export const UrlHistoryManager = withDependencies(
	[
		named(MasterPageFeatureConfigSymbol, name),
		named(FeatureExportsSymbol, name),
		BrowserWindowSymbol,
		ViewerModelSym,
		multi(SamePageUrlChangeListenerSymbol),
		CurrentRouteInfoSymbol,
		LoggerSymbol,
	],
	(
		{ popupPages }: RouterMasterPageConfig,
		routerExports: IFeatureExportsStore<typeof name>,
		browserWindow: BrowserWindow,
		viewerModel: ViewerModel,
		samePageUrlChangeListeners: Array<ISamePageUrlChangeListener>,
		currentRouteInfo: ICurrentRouteInfo,
		logger: ILogger
	): IAppWillLoadPageHandler & IUrlHistoryManager => {
		const urlManagerApi = createUrlHistoryManager({
			browserWindow,
			requestUrl: viewerModel.requestUrl,
			externalBaseUrl: viewerModel.site.externalBaseUrl,
			onUrlChangeListeners: samePageUrlChangeListeners,
			currentRouteInfo,
			logger,
		})

		routerExports.export({
			addOnUrlChangeListener: urlManagerApi.addOnUrlChangeListener,
			removeOnUrlChangeListener: urlManagerApi.removeOnUrlChangeListener,
		})
		return {
			name: 'urlManager',
			appWillLoadPage({ pageId }) {
				// Popups are triggering appWillLoadPage without updating the currentRouteInfo, so we ignore it for
				// deciding whether to samePageUrlChangeListener.onUrlChange() (Otherwise we loose the same page
				// context after a popup is opened).
				if (popupPages[pageId]) {
					return
				}

				// Keeping track of previous page ID so we know when url is changed within the same page (Assuming
				// pushUrlState happens after this appWillLoadPage).
				logger.updatePageId(pageId)
				urlManagerApi.updateState(pageId)
			},
			pushUrlState: (parsedUrl: URL, navigationParams: Omit<NavigationParams, 'anchorDataId'> = {}) => {
				urlManagerApi.pushUrl(parsedUrl, navigationParams)
				routerExports.export({
					currentUrl: urlManagerApi.api.getFullUrlWithoutQueryParams(),
					currentUrlWithQueryParams: urlManagerApi.getCurrentUrl(),
					relativeUrl: urlManagerApi.api.getRelativeUrl(),
				})
			},
			...urlManagerApi.api,
		}
	}
)

export const PopStateListener = withDependencies(
	[
		multi(PopHistoryStateHandler),
		BrowserWindowSymbol,
		multi(SamePageUrlChangeListenerSymbol),
		CurrentRouteInfoSymbol,
	] as const,
	(
		popStateHandlers: Array<IUrlHistoryPopStateHandler>,
		browserWindow: BrowserWindow,
		samePageUrlChangeListeners: Array<ISamePageUrlChangeListener>,
		currentRouteInfo: ICurrentRouteInfo
	): IAppWillMountHandler => ({
		appWillMount: () => {
			if (!browserWindow) {
				return
			}

			if (browserWindow.history) {
				browserWindow.history.scrollRestoration = 'manual'
			}

			browserWindow.addEventListener('popstate', async () => {
				const href = browserWindow.location.href
				await Promise.all(popStateHandlers.map((handler) => handler.onPopState(new URL(href))))

				const pageIdBeforeHandlingPopState = currentRouteInfo.getPreviousRouterInfo()?.pageId
				const pageIdAfterHandlingPopState = currentRouteInfo.getCurrentRouteInfo()?.pageId
				// when the first url change is due to a navigation to a tpa section, and the back button is hit, there's no prev route info
				if (!pageIdBeforeHandlingPopState || pageIdBeforeHandlingPopState === pageIdAfterHandlingPopState) {
					samePageUrlChangeListeners.forEach((listener) => listener.onUrlChange(new URL(href)))
				}
			})
		},
	})
)
