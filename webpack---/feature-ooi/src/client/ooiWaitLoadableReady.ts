import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CurrentRouteInfoSymbol,
	ExperimentsSymbol,
	PageFeatureConfigSymbol,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import type { Experiments, IPageWillMountHandler, OOIWidgetConfig, ViewerModel } from '@wix/thunderbolt-symbols'
import _ from 'lodash'
import { name, ReactLoaderForOOISymbol } from '../symbols'
import type { OOIPageConfig } from '../types'
import { OOIComponentLoader } from '../types'
import { ICurrentRouteInfo } from 'feature-router'
import { isLazyLoadCompatible } from '@wix/thunderbolt-components-loader'

// delete when merging 'specs.thunderbolt.ooi_register_in_app_will_mount'
export const ooiWaitLoadableReady = withDependencies(
	[
		ReactLoaderForOOISymbol,
		named(PageFeatureConfigSymbol, name),
		CurrentRouteInfoSymbol,
		ExperimentsSymbol,
		ViewerModelSym,
	],
	(
		ooiComponentsLoader: OOIComponentLoader,
		{ ooiComponents, pagesToShowSosp }: OOIPageConfig,
		currentRouteInfo: ICurrentRouteInfo,
		experiments: Experiments,
		viewerModel: ViewerModel
	): IPageWillMountHandler => {
		return {
			name: 'ooiWaitLoadableReady',
			async pageWillMount() {
				const shouldApplyLazyLoad =
					(experiments['specs.thunderbolt.ooi_lazy_load_components'] ||
						experiments['specs.thunderbolt.viewport_hydration_extended_react_18']) &&
					isLazyLoadCompatible(viewerModel)
				const shouldSuspenseWidget = (widgetId: string) =>
					shouldApplyLazyLoad && !viewerModel.react18HydrationBlackListWidgets?.includes(widgetId)
				const pageId = currentRouteInfo.getCurrentRouteInfo()?.pageId
				const shouldWaitComponentInCurrentPage = (component: OOIWidgetConfig) => {
					if (!component.isInSosp && (component.isInSlot || !shouldSuspenseWidget(component.widgetId))) {
						return true
					}

					return pageId && pagesToShowSosp[pageId]
				}
				const ooiComponentsForCurrnetPage = _.pickBy(ooiComponents, shouldWaitComponentInCurrentPage)

				await Promise.all([
					..._.map(ooiComponentsForCurrnetPage, async ({ widgetId }, compId) => {
						const { waitForLoadableReady } = await ooiComponentsLoader.getComponent(widgetId)
						await waitForLoadableReady?.(compId)
					}),
				])
			},
		}
	}
)
