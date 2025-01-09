import { multi, withDependencies } from '@wix/thunderbolt-ioc'
import {
	AppStructure,
	ComponentLibrariesSymbol,
	CurrentRouteInfoSymbol,
	Experiments,
	ExperimentsSymbol,
	ICurrentRouteInfo,
	ILogger,
	INavigationManager,
	LoggerSymbol,
	NavigationManagerSymbol,
	SuspendedCompsAPI,
	SuspendedCompsSym,
	ViewerModel,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import type {
	ComponentsLoaderRegistry,
	ComponentsRegistry,
	ComponentLibraries,
	CompControllersRegistry,
	IComponentsRegistrar,
	ComponentModule,
	ComponentLoaderFunction,
} from './types'
import { IComponentsLoader } from './IComponentLoader'
import { createViewportObserver, getCompClassType, taskify } from '@wix/thunderbolt-commons'
import { ComponentsRegistrarSymbol, ExecuteComponentWrappersSymbol } from './symbols'

import { createSuspenseWrapper, WithHydrateWrapperCSR } from './suspenseManagerClient'
import { WithHydrateWrapperSSR } from './suspenseManagerSSR'
import { isLazyLoadCompatible } from './helpers'
import { lazy } from 'react'

const CONTAINERS_COMP_TYPES_WITH_SUSPPENDED_CHILDREN = ['Section', 'ClassicSection', 'FooterSection']
const TPA_WIDGET_NATIVE_COMP_TYPE = 'tpaWidgetNative'
const COMP_TYPES_LAZY_BLACKLIST_PREFIXES = [
	'HeaderContainer',
	'StylableHorizontalMenu',
	'DivWithChildren',
	'Page',
	'RefComponent',
	'HeaderSection',
	'HamburgerMenuRoot',
	'HamburgerOverlay',
	'HamburgerMenuContainer',
	'ResponsiveContainer',
	'Anchor',
]

const isCsr = !!process.env.browser

type ComponentsLoaderFactory = (
	componentsLibraries: ComponentLibraries,
	componentsRegistrars: Array<IComponentsRegistrar>,
	logger: ILogger,
	viewerModel: ViewerModel,
	suspendedComps: SuspendedCompsAPI,
	executeWrappers: {
		executeWrappers: (Component: ComponentModule<unknown>['component']) => ComponentModule<unknown>['component']
	},
	navigationManager: INavigationManager,
	experiments: Experiments,
	currentRouteInfo: ICurrentRouteInfo
) => IComponentsLoader

const isComponentModule = <T>(loader: any): loader is ComponentModule<T> => !!loader.component

const componentsLoaderFactory: ComponentsLoaderFactory = (
	componentsLibraries,
	componentsRegistrars,
	logger,
	viewerModel,
	suspendedComps,
	{ executeWrappers },
	navigationManager,
	experiments,
	currentRouteInfo
) => {
	const lazyManifestsResolvers: Array<() => Promise<void>> = []
	const componentsLoaderRegistry: ComponentsLoaderRegistry = {}
	const componentsRegistry: ComponentsRegistry = {}
	const suspendedComponentsRegistry: ComponentsRegistry = {}
	const compControllersRegistry: CompControllersRegistry = {}
	const suspenseBlacklist =
		viewerModel.react18HydrationBlackListWidgets?.reduce((acc, widgetId) => {
			acc[getCompClassType(TPA_WIDGET_NATIVE_COMP_TYPE, widgetId)] = true
			return acc
		}, {} as Record<string, boolean>) || {}
	const debugRendering = viewerModel.requestUrl.includes('debugRendering=true')
	const isOOIComponentsRegistrar = experiments['specs.thunderbolt.ooi_register_with_components_registrar']
	const shouldSuspenseContainers =
		viewerModel.experiments['specs.thunderbolt.viewport_hydration_extended_react_18'] &&
		!viewerModel.react18HydrationBlackListWidgets?.length

	const shouldApplySuspenseInPage = () =>
		isLazyLoadCompatible(viewerModel) &&
		!currentRouteInfo.didLandOnProtectedPage() &&
		navigationManager.isFirstPage() &&
		(!isCsr || !window.clientSideRender)

	const getComponentLoader = async (compType: string) => {
		const loader = componentsLoaderRegistry[compType]

		if (!loader && lazyManifestsResolvers.length) {
			await Promise.all(lazyManifestsResolvers.map((resolver) => resolver()))
			return componentsLoaderRegistry[compType]
		}

		return loader
	}

	const loadComponentModule = async (compType: string, useRegistry = true) => {
		if (useRegistry && componentsRegistry[compType]) {
			return { component: componentsRegistry[compType] }
		}
		const loader = await getComponentLoader(compType)
		isCsr && (await window.externalsRegistry.react.loaded) // components require React within their code so they have to be evaluated once React is defined.
		const module = await taskify(() => loader())
		if (isComponentModule(module)) {
			module.component.displayName = compType
			if (module.controller) {
				compControllersRegistry[compType] = module.controller
			}
			isCsr && (await window.externalsRegistry.react.loaded)
			return { ...module, component: executeWrappers(module.component) }
		}
		return { ...module, component: executeWrappers(module.default) }
	}

	const createSuspenseComponentCSR = (compType: string) => {
		if (suspendedComponentsRegistry[compType]) {
			return suspendedComponentsRegistry[compType]
		}
		const deferredComponentLoaderFactory = (compId: string) => {
			if (!shouldApplySuspenseInPage()) {
				return {
					componentPromise: Promise.resolve(
						loadComponentModule(compType, false).then((module) => module.component)
					),
					onUnmount: () => {},
				}
			}
			let promise: Promise<void>,
				cleaner: () => void = () => {}
			if (
				isOOI(compType) &&
				experiments['specs.thunderbolt.viewport_hydration_extended_react_18'] &&
				!experiments['specs.thunderbolt.ooi_lazy_load_components']
			) {
				promise = Promise.resolve()
			} else {
				const { promise: viewportObserverPromise, cleaner: viewportObserverCleaner } = createViewportObserver(
					compId
				)
				promise = viewportObserverPromise
				cleaner = viewportObserverCleaner
			}
			return {
				componentPromise: promise
					.then(() => loadComponentModule(compType, false))
					.then(async (module) => {
						if (!componentsRegistry[compType]) {
							componentsRegistry[compType] = module.component
						}
						if ((module as any).waitForLoadableReady) {
							const { waitForLoadableReady } = module as any
							await waitForLoadableReady?.(compId)
						}
						return module.component
					}),
				onUnmount: cleaner,
			}
		}
		const comp = WithHydrateWrapperCSR({
			deferredComponentLoaderFactory,
			setIsWaitingSuspense: suspendedComps.setIsWaitingSuspense,
			debugRendering,
			logger,
		})
		return comp
	}

	const createSuspenseComponentSSR = async (compType: string) => {
		const Comp = (await loadComponentModule(compType)).component
		return WithHydrateWrapperSSR({
			Comp,
		})
	}

	const createSuspenseComponent = isCsr ? createSuspenseComponentCSR : createSuspenseComponentSSR

	const registerComponent = async (compType: string) => {
		return shouldSuspenseComponent(compType)
			? registerSuspendedComponent(compType)
			: loadAndRegisterComponent(compType)
	}

	const shouldReportMissingLoader = (compType: string) => isOOIComponentsRegistrar && isOOI(compType)

	const loadAndRegisterComponent = async (compType: string) => {
		if (componentsRegistry[compType]) {
			return
		}

		const loader = await getComponentLoader(compType)

		if (!loader) {
			if (shouldReportMissingLoader(compType)) {
				const message = `loadAndRegisterComponent -> Component loader for ${compType} is not defined`
				console.error(message)
				logger.captureError(new Error(message), { tags: { feature: 'components' } })
			}
			return
		}
		// components require React within their code so they have to be evaluated once React is defined.
		isCsr && (await window.externalsRegistry.react.loaded)
		if (shouldLazyLoadComponent(compType)) {
			const load = () => loadComponentModule(compType, false).then((module) => ({ default: module.component }))
			const LazyComp = isCsr ? lazy(load) : (await load()).default
			componentsRegistry[compType] = createSuspenseWrapper({
				LazyComp,
				setIsWaitingSuspense: suspendedComps.setIsWaitingSuspense,
				getIsWaitingSuspense: suspendedComps.getIsWaitingSuspense,
			})
		} else {
			componentsRegistry[compType] = (await loadComponentModule(compType)).component
		}
	}

	const registerSuspendedComponent = async (compType: string) => {
		if (suspendedComponentsRegistry[compType]) {
			return
		}

		const loader = await getComponentLoader(compType)

		if (!loader) {
			if (shouldReportMissingLoader(compType)) {
				const message = `registerSuspendedComponent -> Component loader for ${compType} is not defined`
				console.error(message)
				logger.captureError(new Error(message), { tags: { feature: 'components' } })
			}
			return
		}
		// components require React within their code so they have to be evaluated once React is defined.
		isCsr && (await window.externalsRegistry.react.loaded)
		suspendedComponentsRegistry[compType] = await createSuspenseComponent(compType)
	}

	const shouldLazyLoadComponent = (compType: string) =>
		shouldSuspenseContainers &&
		shouldApplySuspenseInPage() &&
		!COMP_TYPES_LAZY_BLACKLIST_PREFIXES.find((prefix) => compType.startsWith(prefix))

	const isOOI = (compType: string) => compType.startsWith(TPA_WIDGET_NATIVE_COMP_TYPE)

	const shouldSuspenseComponent = (compType: string) =>
		shouldApplySuspenseInPage() &&
		!suspenseBlacklist[compType] &&
		((isOOI(compType) &&
			(experiments['specs.thunderbolt.ooi_lazy_load_components'] ||
				experiments['specs.thunderbolt.viewport_hydration_extended_react_18'])) ||
			(shouldSuspenseContainers &&
				CONTAINERS_COMP_TYPES_WITH_SUSPPENDED_CHILDREN.find((type) => compType.startsWith(type))))

	const getRequiredComps = (structure: AppStructure) => {
		const allCompClassTypes = Object.entries(structure).map(([_, { componentType, uiType, isInSlot }]) => {
			const compClassType = getCompClassType(componentType, uiType)
			if (!experiments['specs.thunderbolt.suspenseInSlots'] && isInSlot) {
				suspenseBlacklist[compClassType] = true
			}
			return compClassType
		})
		const uniqueCompTypes = [...new Set(allCompClassTypes)]
		return uniqueCompTypes
	}

	const registerLibraries = taskify(async () => {
		const assignComponents = (components: Record<string, any>) => {
			Object.assign(componentsLoaderRegistry, components)
		}

		logger.phaseStarted('componentsLibraries')
		const libs = [...componentsRegistrars, ...(await componentsLibraries)]
		logger.phaseEnded('componentsLibraries')

		logger.phaseStarted('componentLoaders')
		libs.forEach(({ getAllComponentsLoaders, getComponents }) => {
			assignComponents(getComponents())

			if (getAllComponentsLoaders) {
				lazyManifestsResolvers.push(async () => {
					assignComponents(await getAllComponentsLoaders())
				})
			}
		})
		logger.phaseEnded('componentLoaders')
	})

	return {
		getComponentsMap: () => componentsRegistry,
		getCompControllersMap: () => compControllersRegistry,
		loadComponents: async (structure) => {
			await registerLibraries
			const requiredComps = getRequiredComps(structure)
			return Promise.all(requiredComps.map((compType) => registerComponent(compType)))
		},
		loadAllComponents: async () => {
			await registerLibraries
			const requiredComps = Object.keys(componentsLoaderRegistry)
			return Promise.all(requiredComps.map((compType) => registerComponent(compType)))
		},
		loadComponent: async (componentType: string, uiType?: string) => {
			await registerLibraries
			const compType = getCompClassType(componentType, uiType)
			return registerComponent(compType)
		},
		// delete when merging 'specs.thunderbolt.ooi_register_in_app_will_mount'
		registerSuspendedComponent: (compType: string, loader: ComponentLoaderFunction<any>, { uiType } = {}) => {
			const componentType = getCompClassType(compType, uiType)
			componentsLoaderRegistry[componentType] = loader
			registerComponent(componentType)
		},
		// delete when merging 'specs.thunderbolt.ooi_register_in_app_will_mount'
		registerComponent: (compType: string, loader: ComponentLoaderFunction<any>, { uiType } = {}) => {
			const componentType = getCompClassType(compType, uiType)
			componentsLoaderRegistry[componentType] = loader
			return loadAndRegisterComponent(componentType)
		},
		getComponentToRender: (compType: string) =>
			shouldSuspenseComponent(compType)
				? suspendedComponentsRegistry[compType]
				: componentsRegistry[compType] || suspendedComponentsRegistry[compType],
		executeComponentWrappers: (Component: React.ComponentType<any>) => executeWrappers(Component),
	}
}

export const ComponentsLoader = withDependencies(
	[
		ComponentLibrariesSymbol,
		multi(ComponentsRegistrarSymbol),
		LoggerSymbol,
		ViewerModelSym,
		SuspendedCompsSym,
		ExecuteComponentWrappersSymbol,
		NavigationManagerSymbol,
		ExperimentsSymbol,
		CurrentRouteInfoSymbol,
	] as const,
	componentsLoaderFactory
)
