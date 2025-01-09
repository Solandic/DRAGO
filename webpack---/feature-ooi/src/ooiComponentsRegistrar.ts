import { ComponentLoaderFunction, IComponentsRegistrar } from '@wix/thunderbolt-components-loader'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { Experiments, ExperimentsSymbol, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { ReactLoaderForOOISymbol, name } from './symbols'
import { OOIComponentData, OOIComponentLoader, OOISiteConfig } from './types'
import { OOIReporterSymbol, Reporter } from './reporting'
import { transform } from 'lodash'
import { getCompClassType } from '@wix/thunderbolt-commons'

const TPA_WIDGET_NATIVE_COMP_TYPE = 'tpaWidgetNative'

export const ooiComponentsRegistrar = withDependencies(
	[named(SiteFeatureConfigSymbol, name), ExperimentsSymbol, ReactLoaderForOOISymbol, OOIReporterSymbol],
	(
		{ ooiComponentsData }: OOISiteConfig,
		experiments: Experiments,
		ooiComponentsLoader: OOIComponentLoader,
		reporter: Reporter
	): IComponentsRegistrar => {
		const isOOIComponentsRegistrar = experiments['specs.thunderbolt.ooi_register_with_components_registrar']
		const isSSR = !process.env.browser

		if (!isOOIComponentsRegistrar) {
			return {
				getComponents: () => ({}),
			}
		}

		const loadComponent = async ({ widgetId }: { widgetId: OOIComponentData['widgetId'] }) => {
			const { component, waitForLoadableReady } = await ooiComponentsLoader.getComponent(widgetId)
			if (isSSR) {
				return { default: component }
			}

			const { sentryDsn } = ooiComponentsData[widgetId]

			if (!component) {
				reporter.reportError(new Error('component is not exported'), sentryDsn, {
					tags: { phase: 'ooi component resolution' },
				})
			}

			return {
				default: component,
				waitForLoadableReady,
			}
		}

		const components = transform(
			ooiComponentsData,
			(res: Record<string, ComponentLoaderFunction<any>>, _, widgetId) => {
				res[getCompClassType(TPA_WIDGET_NATIVE_COMP_TYPE, widgetId)] = () => loadComponent({ widgetId })
			}
		)
		return {
			getComponents: () => components,
		}
	}
)
