import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	SiteFeatureConfigSymbol,
	BrowserWindowSymbol,
	CurrentRouteInfoSymbol,
	Props,
	IPropsStore,
	IStructureAPI,
	StructureAPI,
	IAppWillLoadPageHandler,
	ViewerModelSym,
	ViewerModel,
} from '@wix/thunderbolt-symbols'
import type { Window } from './types'
import { name } from './symbols'
import { ICurrentRouteInfo } from 'feature-router'
import { INavigationManager, NavigationManagerSymbol } from 'feature-navigation-manager'
import { handleCodeEmbeds } from './codeEmbedApi'
import { loadRequireJS } from '@wix/thunderbolt-commons'
import { CodeEmbedsSiteConfig } from './types'

const codeEmbedFactory = (
	{ htmlEmbeds, shouldLoadRequireJS }: CodeEmbedsSiteConfig,
	window: Window,
	currentRouteInfo: ICurrentRouteInfo,
	navigationManager: INavigationManager,
	props: IPropsStore,
	structureAPI: IStructureAPI,
	{ siteAssets }: ViewerModel
): IAppWillLoadPageHandler => {
	return {
		name: 'codeEmbed',
		async appWillLoadPage({ pageId, contextId }) {
			if (navigationManager.isFirstNavigation()) {
				return
			}

			const wrapperId = structureAPI.getPageWrapperComponentId(pageId, contextId)

			const addCodeEmbeds = handleCodeEmbeds(
				htmlEmbeds,
				pageId,
				window,
				currentRouteInfo.getPreviousRouterInfo()?.pageId
			)

			props.update({
				[wrapperId]: {
					codeEmbedsCallback: async () => {
						if (shouldLoadRequireJS) {
							await loadRequireJS(window, siteAssets.clientTopology.moduleRepoUrl)
						}
						addCodeEmbeds()
					},
				},
			})
		},
	}
}

export const CodeEmbed = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		BrowserWindowSymbol,
		CurrentRouteInfoSymbol,
		NavigationManagerSymbol,
		Props,
		StructureAPI,
		ViewerModelSym,
	],
	codeEmbedFactory
)
