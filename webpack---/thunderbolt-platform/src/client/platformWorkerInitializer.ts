import _ from 'lodash'
import { proxy, wrap, createEndpoint } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax
import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	IComponentsStylesOverrides,
	IPropsStore,
	Props,
	Structure,
	ComponentsStylesOverridesSymbol,
	PlatformWorkerPromiseSym,
	PlatformWorkerPromise,
	ILogger,
	LoggerSymbol,
	IStructureStore,
	ExperimentsSymbol,
	Experiments,
	CompsLifeCycleSym,
	ICompsLifeCycle,
	INavigationManager,
	NavigationManagerSymbol,
} from '@wix/thunderbolt-symbols'
import type { BootstrapData, PlatformInitializer, PlatformWarmupDataManagerAPI } from '../types'
import type { InvokeSiteHandler, InvokeViewerHandler, PlatformClientWorkerAPI } from '../core/types'
import { PlatformWarmupDataManagerSymbol } from '../symbols'

export default withDependencies<PlatformInitializer>(
	[PlatformWarmupDataManagerSymbol, Props, Structure, ComponentsStylesOverridesSymbol, LoggerSymbol, PlatformWorkerPromiseSym, ExperimentsSymbol, CompsLifeCycleSym, NavigationManagerSymbol],
	(
		platformWarmupDataManager: PlatformWarmupDataManagerAPI,
		propsStore: IPropsStore,
		structureStore: IStructureStore,
		componentsStylesOverrides: IComponentsStylesOverrides,
		logger: ILogger,
		{ platformWorkerPromise }: { platformWorkerPromise: PlatformWorkerPromise },
		experiments: Experiments,
		compsLifeCycle: ICompsLifeCycle,
		navigationManager: INavigationManager
	): PlatformInitializer => {
		const isDynamicHydrationEnabled = experiments['specs.thunderbolt.viewport_hydration_extended_react_18']
		// This map indicates that a certain component update is pending for the component to be rendered,
		// in that case we want all the following updates to wait so that we always end up with the latest prop
		const compsPendingRender: { [compId: string]: boolean } = {}
		const shouldWaitForCompRender = (compId: string) => (isDynamicHydrationEnabled && navigationManager.isFirstNavigation() && !window.clientSideRender) || compsPendingRender[compId]
		platformWorkerPromise
			.then((worker) =>
				worker!.addEventListener('error', ({ message }) => {
					logger.captureError(new Error(message), {
						tags: { feature: 'platform', worker: true, dontReportIfPanoramaEnabled: true },
					})
				})
			)
			.catch((e) => {
				throw new Error(`platformWorkerPromise falied with error - ${e}`)
			})

		return {
			async initPlatformOnSite(bootstrapData: BootstrapData, invokeSiteHandler: InvokeSiteHandler) {
				const worker = (await platformWorkerPromise)!
				const { initPlatformOnSite }: PlatformClientWorkerAPI = wrap(worker)
				initPlatformOnSite(
					bootstrapData,
					proxy(async (...args) => {
						const res = await invokeSiteHandler(...args)
						return _.isFunction(res) ? proxy(res) : res
					})
				)
			},
			async runPlatformOnPage(bootstrapData: BootstrapData, invokeViewerHandler: InvokeViewerHandler) {
				const worker = (await platformWorkerPromise)!
				const workerProxy = wrap(worker)
				const workerMessagePort = await workerProxy[createEndpoint]()
				// prevent malicious "self.onmessage =" user code from sniffing messages upon navigation, specifically platformEnvData.site.applicationsInstances.
				const workerSecureProxy: PlatformClientWorkerAPI = wrap(workerMessagePort)
				return workerSecureProxy.runPlatformOnPage(
					bootstrapData,
					proxy(async (...args) => {
						const res = await invokeViewerHandler(...args)
						return _.isFunction(res) ? proxy(res) : res
					})
				)
			},
			async updateProps(partialProps) {
				if (isDynamicHydrationEnabled) {
					_.forEach(partialProps, async (compProps, compId) => {
						if (shouldWaitForCompRender(compId)) {
							compsPendingRender[compId] = true
							compsLifeCycle.waitForComponentToRender(compId).then(async () => {
								propsStore.update({ [compId]: compProps })
								compsPendingRender[compId] = false
							})
						} else {
							propsStore.update({ [compId]: compProps })
						}
					})
				} else if (await platformWarmupDataManager.shouldUseManager()) {
					await platformWarmupDataManager.updateProps(partialProps)
				} else {
					propsStore.update(partialProps)
				}
			},
			async updateStyles(styleData) {
				if (isDynamicHydrationEnabled) {
					_.forEach(styleData, async (compStyles, compId) => {
						if (shouldWaitForCompRender(compId)) {
							compsPendingRender[compId] = true
							compsLifeCycle.waitForComponentToRender(compId).then(async () => {
								componentsStylesOverrides.set({ [compId]: compStyles })
								compsPendingRender[compId] = false
							})
						} else {
							componentsStylesOverrides.set({ [compId]: compStyles })
						}
					})
				} else if (await platformWarmupDataManager.shouldUseManager()) {
					await platformWarmupDataManager.updateStyles(styleData)
				} else {
					componentsStylesOverrides.set(styleData)
				}
			},
			async updateStructure(partialStructure) {
				if (isDynamicHydrationEnabled) {
					_.forEach(partialStructure, async (compStructure, compId) => {
						if (shouldWaitForCompRender(compId)) {
							compsPendingRender[compId] = true
							compsLifeCycle.waitForComponentToRender(compId).then(async () => {
								structureStore.update({ [compId]: compStructure })
								compsPendingRender[compId] = false
							})
						} else {
							structureStore.update({ [compId]: compStructure })
						}
					})
				} else if (await platformWarmupDataManager.shouldUseManager()) {
					await platformWarmupDataManager.updateStructure(partialStructure)
				} else {
					structureStore.update(partialStructure)
				}
			},
		}
	}
)
