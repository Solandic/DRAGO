import _ from 'lodash'
import { createPromise } from '@wix/thunderbolt-commons'
import type { IComponentSdksManager } from '../types'
import type { IPlatformLogger, IModelsAPI } from '@wix/thunderbolt-symbols'
import type { BootstrapData, ComponentSdks, ComponentSdksLoader, CoreSdkLoaders } from '../../types'
import { LOAD_COMPONENT_SDKS_PROMISE, COMPONENT_SDKS_MANAGER, MODELS_API, PLATFORM_LOGGER, BOOTSTRAP_DATA } from './moduleNames'

const getSdkTypesToLoad = (modelsApi: IModelsAPI) => {
	const compIdToConnections = modelsApi.getCompIdConnections()
	const structureModel = modelsApi.getStructureModel()
	const slots = modelsApi.getSlots()
	const props = modelsApi.getPropsModel()

	const platformBuilderComponentsIds = _.keys(_.pickBy(structureModel, (comp) => comp.componentType.startsWith('platform.builder')))
	const mergedStructure = platformBuilderComponentsIds.reduce((acc, id) => ({ ...acc, ...props[id].structure }), structureModel)

	return [
		'PageBackground',
		..._(mergedStructure)
			.transform((sdkTypes, compStructure, compId) => {
				if (compIdToConnections[compId]) {
					sdkTypes[compStructure.componentType] = true
				}

				_.forEach(slots[compId], (slotCompId) => {
					sdkTypes[_.get(mergedStructure, [slotCompId, 'componentType'])] = true
				})
			}, {} as Record<string, boolean>)
			.keys()
			.value(),
	]
}

const ComponentSdksManager = (loadComponentSdksPromise: Promise<ComponentSdksLoader>, modelsApi: IModelsAPI, logger: IPlatformLogger, bootstrapData: BootstrapData): IComponentSdksManager => {
	const componentsSdks: ComponentSdks = {}
	const sdkTypesToCompTypesMapper: ComponentSdksLoader['sdkTypeToComponentTypes'] = {}
	const { resolver: sdkResolver, promise: sdkPromise } = createPromise()

	const loadCoreComponentSdks = async (compTypes: Array<string>, coreSdksLoaders: CoreSdkLoaders) => {
		const compsPromises = [...compTypes, 'Document', 'RefComponent']
			.filter((type) => coreSdksLoaders[type])
			.map((type) =>
				coreSdksLoaders[type]()
					.then((sdkFactory) => ({ [type]: sdkFactory }))
					.catch((e) => {
						if (e.name !== 'NetworkError') {
							logger.captureError(new Error('could not load core component SDKs from thunderbolt'), {
								groupErrorsBy: 'values',
								tags: { method: 'loadCoreComponentSdks', error: `${e.name}: ${e.message}` },
								extra: { type },
							})
						}
						return {}
					})
			)
		const sdksArray = await Promise.all(compsPromises)
		return Object.assign({}, ...sdksArray)
	}

	return {
		async fetchComponentsSdks(coreSdksLoaders: CoreSdkLoaders) {
			const compTypes = getSdkTypesToLoad(modelsApi)
			logger.interactionStarted('loadComponentSdk')
			const { loadComponentSdks, sdkTypeToComponentTypes } = await loadComponentSdksPromise
			Object.assign(sdkTypesToCompTypesMapper, sdkTypeToComponentTypes || {})
			if (!loadComponentSdks) {
				sdkResolver()
				return
			}
			const componentSdksPromise = loadComponentSdks(compTypes, logger).catch((e) => {
				if (e.name !== 'NetworkError') {
					logger.captureError(new Error('could not load component SDKs from loadComponentSdks function'), {
						groupErrorsBy: 'values',
						tags: { errorType: 'load-component-SDKs-failed', method: 'loadComponentSdks', error: `${e.name}: ${e.message}` },
						extra: { compTypes, componentsRegistry: bootstrapData.platformEnvData.componentsRegistry, ...(e.extraParams ? e.extraParams : {}) },
					})
				}
				return {}
			})
			const [coreSdks, sdks] = await Promise.all([loadCoreComponentSdks(compTypes, coreSdksLoaders), componentSdksPromise]).catch(() => [])
			Object.assign(componentsSdks, sdks, coreSdks)
			sdkResolver()
			logger.interactionEnded('loadComponentSdk')
		},
		waitForSdksToLoad() {
			return sdkPromise
		},
		getComponentSdkFactory(compType) {
			const sdkFactory = componentsSdks[compType]
			if (!sdkFactory) {
				logger.captureError(new Error('could not find component SDK'), {
					groupErrorsBy: 'values',
					tags: { method: 'loadComponentSdks', compType },
				})
				return
			}
			return sdkFactory
		},
		getSdkTypeToComponentTypes(sdkType: string) {
			return sdkTypesToCompTypesMapper[sdkType] || [sdkType]
		},
	}
}

export default {
	factory: ComponentSdksManager,
	deps: [LOAD_COMPONENT_SDKS_PROMISE, MODELS_API, PLATFORM_LOGGER, BOOTSTRAP_DATA],
	name: COMPONENT_SDKS_MANAGER,
}
