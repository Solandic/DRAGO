import { optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	SdkHandlersProvider,
	DynamicPagesSymbol,
	BrowserWindowSymbol,
	BrowserWindow,
	IPageAssetsLoader,
	PageAssetsLoaderSymbol,
} from '@wix/thunderbolt-symbols'

import { DynamicPagesAPI } from 'feature-router'
import { SiteWixCodeSdkHandlers } from '../types'

export const siteSdkProvider = withDependencies(
	[optional(DynamicPagesSymbol), PageAssetsLoaderSymbol, BrowserWindowSymbol],
	(
		dynamicPagesAPI: DynamicPagesAPI,
		pageAssetsLoader: IPageAssetsLoader,
		browserWindow: BrowserWindow
	): SdkHandlersProvider<SiteWixCodeSdkHandlers> => ({
		getSdkHandlers: () => ({
			getSitemapFetchParams: (routePrefix) => {
				if (!dynamicPagesAPI) {
					return null
				}

				return dynamicPagesAPI.getSitemapFetchParams(routePrefix)
			},
			prefetchPagesResources: (pagesIds: Array<string>) => {
				// Setting the pages assets to be prefetched
				pagesIds.map((pageId) => pageAssetsLoader.load(pageId, {}))
			},
			getMasterPageStyle: async () => {
				const themStyles = browserWindow?.document.querySelector('#css_masterPage')?.innerHTML || ''
				let cssVarsMapping = ''
				const inlineStyle = browserWindow?.document.querySelector(
					'style[data-url*="wix-thunderbolt/dist/main.renderer"]'
				)?.innerHTML
				if (inlineStyle) {
					cssVarsMapping = inlineStyle
				} else {
					// in case inlineHandler was disabled for some reason
					const linkStyle = (browserWindow?.document.querySelector(
						'link[href*="wix-thunderbolt/dist/main.renderer"]'
					) as HTMLLinkElement)?.href
					if (linkStyle) {
						cssVarsMapping = `@import url('${linkStyle}');`
					}
				}
				return `
				${cssVarsMapping}
				${themStyles}
				`
			},
		}),
	})
)
