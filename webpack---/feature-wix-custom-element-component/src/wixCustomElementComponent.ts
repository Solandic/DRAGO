import _ from 'lodash'
import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	BrowserWindowSymbol,
	BrowserWindow,
	IPropsStore,
	Props,
	ExperimentsSymbol,
	Experiments,
} from '@wix/thunderbolt-symbols'
import { isSSR } from '@wix/thunderbolt-commons'
import { SessionManagerSymbol, ISessionManager } from 'feature-session-manager'
import type { WixCustomElementComponentPageConfig, IWixCustomElementComponent } from './types'
import { name, WixCustomElementComponentAPISymbol } from './symbols'
import { tryToGetCustomElementConnectedToWidget } from './utils'
import { CUSTOM_ELEMENT_GET_APP_TOKEN_EXPERIMENT } from './constants'

export const WixCustomElementComponent = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		BrowserWindowSymbol,
		Props,
		SessionManagerSymbol,
		ExperimentsSymbol,
		optional(WixCustomElementComponentAPISymbol),
	],
	(
		pageFeatureConfig: WixCustomElementComponentPageConfig,
		window: BrowserWindow,
		propsStore: IPropsStore,
		sessionManager: ISessionManager,
		experiments: Experiments,
		customElementComponentAPI?: IWixCustomElementComponent
	): IPageWillMountHandler => {
		return {
			name: 'wixCustomElementComponent',
			async pageWillMount() {
				const isInSeoAndSsrFlow = isSSR(window) && pageFeatureConfig.isInSeo

				if (!customElementComponentAPI) {
					return // site feature was not loaded, see it's predicate
				}

				const updateObj: Record<string, any> = _.chain(pageFeatureConfig.customElements)
					.keyBy('compId')
					.mapValues((customElement) => {
						const nextCustomElement = tryToGetCustomElementConnectedToWidget(
							customElement,
							customElementComponentAPI.customElementWidgets
						)
						return {
							isInSeo: isInSeoAndSsrFlow,
							...(experiments[CUSTOM_ELEMENT_GET_APP_TOKEN_EXPERIMENT]
								? {
										getAppToken: nextCustomElement.appDefId
											? async () =>
													sessionManager.getAppInstanceByAppDefId(nextCustomElement.appDefId!)
											: undefined,
								  }
								: {}),
							isEnabled: customElementComponentAPI.isCustomElementEnabled(nextCustomElement.widgetId),
							tagName: nextCustomElement.tagName,
							scriptType: nextCustomElement.scriptType,
						}
					})
					.value()

				propsStore.update(updateObj)

				if (isSSR(window)) {
					return
				}

				await customElementComponentAPI.loadCustomElementsScripts(pageFeatureConfig.customElements)
			},
		}
	}
)
