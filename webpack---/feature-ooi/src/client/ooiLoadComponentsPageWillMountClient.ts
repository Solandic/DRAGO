import { createPromise } from '@wix/thunderbolt-commons'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CurrentRouteInfoSymbol,
	ExperimentsSymbol,
	PageFeatureConfigSymbol,
	SiteFeatureConfigSymbol,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import type { IPageWillMountHandler, OOIWidgetConfig, Experiments, ViewerModel } from '@wix/thunderbolt-symbols'
import _ from 'lodash'
import { name, ReactLoaderForOOISymbol } from '../symbols'
import type { OOIPageConfig } from '../types'
import { OOIComponentLoader, OOISiteConfig } from '../types'
import { OOIReporterSymbol, Reporter } from '../reporting'
import { ICurrentRouteInfo } from 'feature-router'
import { ComponentsLoaderSymbol, IComponentsLoader, isLazyLoadCompatible } from '@wix/thunderbolt-components-loader'

const TPA_WIDGET_NATIVE_COMP_TYPE = 'tpaWidgetNative'

// delete when merging 'specs.thunderbolt.ooi_register_in_app_will_mount'
export const ooiLoadComponentsPageWillMountClient = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		ReactLoaderForOOISymbol,
		named(PageFeatureConfigSymbol, name),
		OOIReporterSymbol,
		CurrentRouteInfoSymbol,
		ExperimentsSymbol,
		ViewerModelSym,
		ComponentsLoaderSymbol,
	],
	(
		{ ooiComponentsData }: OOISiteConfig,
		ooiComponentsLoader: OOIComponentLoader,
		{ ooiComponents, pagesToShowSosp }: OOIPageConfig,
		reporter: Reporter,
		currentRouteInfo: ICurrentRouteInfo,
		experiments: Experiments,
		viewerModel: ViewerModel,
		componentsLoader: IComponentsLoader
	): IPageWillMountHandler => {
		const pageId = currentRouteInfo.getCurrentRouteInfo()?.pageId
		const componentsLoadeddDeffered = createPromise<Array<string>>()
		const isOOIComponentsRegistrar = experiments['specs.thunderbolt.ooi_register_with_components_registrar']
		return {
			name: 'ooiLoadComponentsPageWillMountClient',
			async pageWillMount() {
				if (isOOIComponentsRegistrar) {
					return
				}
				const debugRendering = viewerModel.requestUrl.includes('debugRendering=true')
				const shouldDisplayComponentInCurrentPage = (component: OOIWidgetConfig) => {
					if (!component.isInSosp) {
						return true
					}

					return pageId && pagesToShowSosp[pageId]
				}

				const ooiComponentsForCurrnetPage = _.pickBy(ooiComponents, shouldDisplayComponentInCurrentPage)
				const shouldApplyLazyLoad =
					experiments['specs.thunderbolt.ooi_lazy_load_components'] && isLazyLoadCompatible(viewerModel)
				const shouldSuspenseWidget = (widgetId: string) =>
					shouldApplyLazyLoad && !viewerModel.react18HydrationBlackListWidgets?.includes(widgetId)
				const loadComponent = async ({
					widgetId,
					compId,
				}: {
					widgetId: OOIWidgetConfig['widgetId']
					compId: OOIWidgetConfig['compId']
				}) => {
					if (debugRendering) {
						console.log(`downloading tpaWidgetNative {widgetId: ${widgetId}, compId: ${compId}}`)
					}
					const { component, waitForLoadableReady } = await ooiComponentsLoader.getComponent(widgetId)

					const { sentryDsn } = ooiComponentsData[widgetId]

					if (!component) {
						reporter.reportError(new Error('component is not exported'), sentryDsn, {
							tags: { phase: 'ooi component resolution' },
						})
					}
					return {
						waitForLoadableReady,
						default: component,
					}
				}

				await Promise.all([
					..._.map(ooiComponentsForCurrnetPage, async ({ widgetId }, compId) => {
						const loader = async () => {
							const module = await loadComponent({ widgetId, compId })
							return module
						}

						const registerComponentApi = shouldSuspenseWidget(widgetId)
							? componentsLoader.registerSuspendedComponent
							: componentsLoader.registerComponent
						registerComponentApi(TPA_WIDGET_NATIVE_COMP_TYPE, loader, { uiType: widgetId })
					}),
				])

				componentsLoadeddDeffered.resolver(_.map(ooiComponentsForCurrnetPage, ({ widgetId }) => widgetId))
			},
		}
	}
)
