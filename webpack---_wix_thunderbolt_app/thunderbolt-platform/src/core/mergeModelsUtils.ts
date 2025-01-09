import { Connections, ExtendedPlatformModel, FeaturesResponse, PlatformModel } from '@wix/thunderbolt-symbols'
import _ from 'lodash'
import { addGhostsInPlace } from './mergeGhosts'

export const mergeConnections = (connections1: Connections, connections2: Connections) => {
	return _.mergeWith(connections2, connections1, (objValue, srcValue) => {
		if (_.isArray(objValue)) {
			// merge connection arrays
			return objValue.concat(srcValue)
		}
	})
}

export const mergeModels = (model: ExtendedPlatformModel, topLevelWidgetModel: ExtendedPlatformModel, topLevelWidgetId: string): ExtendedPlatformModel => {
	if (!model || !topLevelWidgetModel) {
		return model || topLevelWidgetModel
	}

	const applications = _.merge({}, model.platformModel.applications, topLevelWidgetModel.platformModel.applications)
	const connections = mergeConnections(model.platformModel.connections, topLevelWidgetModel.platformModel.connections)
	const onLoadProperties = _.merge({}, model.platformModel.onLoadProperties, topLevelWidgetModel.platformModel.onLoadProperties)
	const sdkData = _.assign({}, model.platformModel.sdkData, topLevelWidgetModel.platformModel.sdkData)
	const sosp = _.assign({}, model.platformModel.sosp, topLevelWidgetModel.platformModel.sosp)
	const staticEvents = _.concat(model.platformModel.staticEvents, topLevelWidgetModel.platformModel.staticEvents)
	const controllerConfigs = _.merge({}, model.platformModel.controllerConfigs, topLevelWidgetModel.platformModel.controllerConfigs)
	const compIdConnections = _.assign({}, model.platformModel.compIdConnections, topLevelWidgetModel.platformModel.compIdConnections)
	const containersChildrenIds = _.assign({}, model.platformModel.containersChildrenIds, topLevelWidgetModel.platformModel.containersChildrenIds)
	const compIdToRepeaterId = _.assign({}, model.platformModel.compIdToRepeaterId, topLevelWidgetModel.platformModel.compIdToRepeaterId)
	const orderedControllers = model.platformModel.orderedControllers?.concat(topLevelWidgetModel.platformModel.orderedControllers) || topLevelWidgetModel.platformModel?.orderedControllers
	const hasTPAComponentOnPage = model.platformModel.hasTPAComponentOnPage || topLevelWidgetModel.platformModel.hasTPAComponentOnPage
	const hasBlocksWidgetOnPage = model.platformModel.hasBlocksWidgetOnPage || topLevelWidgetModel.platformModel.hasBlocksWidgetOnPage
	const responsiveCompsInClassic = _.assign({}, model.platformModel.responsiveCompsInClassic, topLevelWidgetModel.platformModel.responsiveCompsInClassic)
	const slots = _.assign({}, model.platformModel.slots, topLevelWidgetModel.platformModel.slots)
	const allControllersOnPageAreGhosts = model.platformModel?.allControllersOnPageAreGhosts && topLevelWidgetModel?.platformModel.allControllersOnPageAreGhosts

	const pageConfig = _.merge({}, model.pageConfig, topLevelWidgetModel.pageConfig)
	const pageFeatures = _.union(model.pageFeatures, topLevelWidgetModel.pageFeatures)
	const structureModel = _.assign({}, model.structureModel)
	const propsModel = _.merge({}, model.propsModel, { [topLevelWidgetId]: { structure: topLevelWidgetModel.structureModel, compProps: topLevelWidgetModel.pageConfig.render?.compProps } })

	return {
		pageConfig,
		pageFeatures,
		propsModel,
		structureModel,
		platformModel: {
			applications,
			connections,
			onLoadProperties,
			sdkData,
			staticEvents,
			controllerConfigs,
			compIdConnections,
			containersChildrenIds,
			compIdToRepeaterId,
			orderedControllers,
			hasTPAComponentOnPage,
			hasBlocksWidgetOnPage,
			responsiveCompsInClassic,
			slots,
			sosp,
			allControllersOnPageAreGhosts,
			applicationsPublicData: {},
		},
		rawMasterPageStructure: {},
	}
}

export const mergePlatformModels = (pageModel: ExtendedPlatformModel, topLevelWidgetIdToModel: Record<string, ExtendedPlatformModel>): ExtendedPlatformModel =>
	_.reduce(topLevelWidgetIdToModel, (mergedModel, topLevelWidgetModel, topLevelWidgetId) => mergeModels(mergedModel, topLevelWidgetModel, topLevelWidgetId), pageModel) as ExtendedPlatformModel

export const getModelFromSiteAssetsResponses = (isMasterPage: boolean, [platformModel, featuresModel]: [PlatformModel, FeaturesResponse]): ExtendedPlatformModel => {
	const {
		props: pageConfig,
		structure: { components, features },
	} = featuresModel
	const {
		connections,
		applications,
		orderedControllers,
		onLoadProperties,
		sosp,
		hasTPAComponentOnPage,
		responsiveCompsInClassic,
		slots,
		allControllersOnPageAreGhosts,
		hasBlocksWidgetOnPage,
		applicationsPublicData,
	} = platformModel

	const { propsModel, structureModel } = addGhostsInPlace(platformModel, components, pageConfig.render.compProps)

	return {
		pageConfig,
		masterPageConfig: featuresModel.structure.siteFeaturesConfigs,
		pageFeatures: !isMasterPage ? features : [],
		masterPageFeatures: isMasterPage ? features : [],
		propsModel,
		structureModel,
		rawMasterPageStructure: isMasterPage ? components : {},
		platformModel: {
			allControllersOnPageAreGhosts,
			connections,
			applications,
			orderedControllers,
			sdkData: platformModel.sdkData,
			staticEvents: platformModel.staticEvents,
			controllerConfigs: platformModel.controllerConfigs,
			compIdConnections: platformModel.compIdConnections,
			containersChildrenIds: platformModel.containersChildrenIds,
			compIdToRepeaterId: platformModel.compIdToRepeaterId,
			onLoadProperties,
			sosp,
			hasTPAComponentOnPage,
			hasBlocksWidgetOnPage,
			responsiveCompsInClassic,
			slots,
			applicationsPublicData,
		},
	}
}
