import _ from 'lodash'
import type { IPlatformLogger, PlatformModel, FeaturesResponse, WidgetIdToPlatformModelMap } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../types'
import type { ModelsProviderFactoryFunc } from './types'
import { getAPIsOverModel } from './modelsApi'
import { getModelFromSiteAssetsResponses, mergeConnections, mergePlatformModels } from './mergeModelsUtils'

export function ModelsApiProvider(bootstrapData: BootstrapData, modelsProviderFactory: ModelsProviderFactoryFunc, platformLogger: IPlatformLogger) {
	const fetchModels = modelsProviderFactory(platformLogger)

	const fetchPageModel = async (pageType: 'masterPage' | 'page') => {
		const isMasterPage = pageType === 'masterPage'
		const result = await Promise.all([fetchModels('platform', isMasterPage), fetchModels('features', isMasterPage)])
		return getModelFromSiteAssetsResponses(isMasterPage, result as [PlatformModel, FeaturesResponse])
	}

	const getModels = async () => {
		const [pageModel, masterPageModel] = await Promise.all([fetchPageModel('page'), fetchPageModel('masterPage')])

		const applicationsPublicData = { ...masterPageModel.platformModel.applicationsPublicData, ...pageModel.platformModel.applicationsPublicData }

		const shouldNotMergeDataInResponsiveSites = bootstrapData.platformEnvData.site.isResponsive
			? !bootstrapData.platformEnvData.site.experiments['specs.thunderbolt.dataBindingInMasterResponsive']
			: false
		if (shouldNotMergeDataInResponsiveSites || bootstrapData.platformEnvData.bi.pageData.isLightbox) {
			// in responsive there's no need at all for master page data except for the master page features configs and applicationsPublicData.
			// in lightbox scenario we don't want to re-run master page controllers.
			const builderWidgetsPlatformModels: WidgetIdToPlatformModelMap = bootstrapData.platformEnvData.site.experiments['specs.thunderbolt.renderPlatformBuilderComponent']
				? await fetchModels('builderComponent', false)
				: {}

			const fixedBuilderWidgetsModels = _.mapValues(builderWidgetsPlatformModels, (models) => getModelFromSiteAssetsResponses(false, [models.platformModel, models.featuresModel]))
			const mergedModel = mergePlatformModels(pageModel, fixedBuilderWidgetsModels)
			const platformModel = { ...mergedModel.platformModel, applicationsPublicData }
			return { ...mergedModel, platformModel, masterPageConfig: masterPageModel.masterPageConfig || {}, masterPageFeatures: masterPageModel.masterPageFeatures || [] }
		}

		const applications = _.merge({}, masterPageModel.platformModel.applications, pageModel.platformModel.applications)
		const pageConfig = _.merge({}, masterPageModel.pageConfig, pageModel.pageConfig)
		const connections = mergeConnections(masterPageModel.platformModel.connections, pageModel.platformModel.connections)
		const onLoadProperties = _.merge({}, masterPageModel.platformModel.onLoadProperties, pageModel.platformModel.onLoadProperties)
		const structureModel = _.assign({}, masterPageModel.structureModel, pageModel.structureModel)
		const pageFeatures = pageModel.pageFeatures
		const sdkData = _.assign({}, masterPageModel.platformModel.sdkData, pageModel.platformModel.sdkData)
		const staticEvents = _.concat(masterPageModel.platformModel.staticEvents, pageModel.platformModel.staticEvents)
		const controllerConfigs = _.merge({}, masterPageModel.platformModel.controllerConfigs, pageModel.platformModel.controllerConfigs)
		const compIdConnections = _.assign({}, masterPageModel.platformModel.compIdConnections, pageModel.platformModel.compIdConnections)
		const containersChildrenIds = _.assign({}, masterPageModel.platformModel.containersChildrenIds, pageModel.platformModel.containersChildrenIds)
		const compIdToRepeaterId = _.assign({}, masterPageModel.platformModel.compIdToRepeaterId, pageModel.platformModel.compIdToRepeaterId)
		const orderedControllers = masterPageModel.platformModel.orderedControllers.concat(pageModel.platformModel.orderedControllers)
		const hasTPAComponentOnPage = masterPageModel.platformModel.hasTPAComponentOnPage || pageModel.platformModel.hasTPAComponentOnPage
		const hasBlocksWidgetOnPage = masterPageModel.platformModel.hasBlocksWidgetOnPage || pageModel.platformModel.hasBlocksWidgetOnPage
		const responsiveCompsInClassic = _.assign({}, masterPageModel.platformModel.responsiveCompsInClassic, pageModel.platformModel.responsiveCompsInClassic)
		const slots = _.assign({}, masterPageModel.platformModel.slots, pageModel.platformModel.slots)
		const allControllersOnPageAreGhosts = masterPageModel.platformModel.allControllersOnPageAreGhosts && pageModel.platformModel.allControllersOnPageAreGhosts
		const propsModel = pageConfig.render.compProps

		return {
			pageConfig,
			masterPageConfig: masterPageModel.masterPageConfig || {}, // can be undefined in editor
			pageFeatures,
			masterPageFeatures: masterPageModel.masterPageFeatures || [],
			propsModel,
			structureModel,
			rawMasterPageStructure: masterPageModel.rawMasterPageStructure,
			platformModel: {
				allControllersOnPageAreGhosts,
				connections,
				applications,
				orderedControllers,
				sdkData,
				staticEvents,
				controllerConfigs,
				compIdConnections,
				containersChildrenIds,
				onLoadProperties,
				compIdToRepeaterId,
				sosp: masterPageModel.platformModel.sosp,
				hasTPAComponentOnPage,
				hasBlocksWidgetOnPage,
				responsiveCompsInClassic,
				slots,
				applicationsPublicData,
			},
		}
	}

	return {
		async getModelApi() {
			const models = await getModels()
			models.platformModel.orderedControllers = ['wixCode', ...models.platformModel.orderedControllers]
			return getAPIsOverModel(models, bootstrapData)
		},
	}
}
