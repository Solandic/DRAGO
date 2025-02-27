import _ from 'lodash'
import type { Connection, FeatureName, PlatformModel, IModelsAPI } from '@wix/thunderbolt-symbols'
import {
	getDisplayedId,
	getFullId,
	getTemplateItemId,
	getRepeaterItemsFromProps,
	getTemplateCompIdAndRepeaterScope,
	isDisplayedOnly,
	REPEATER_DELIMITER,
	isExperimentOpen,
} from '@wix/thunderbolt-commons'
import type { BootstrapData } from '../types'
import type { RawModel } from './types'
import RenderedAPI from './renderedService'
import { MasterPageId } from './constants'

export const getAPIsOverModel = (model: RawModel, bootstrapData: BootstrapData): IModelsAPI => {
	const shouldInflateRepeaterItemsInRender = isExperimentOpen('specs.thunderbolt.inflateRepeaterItemsInRender', bootstrapData.experiments)
	const getStructureModel = () => model.structureModel
	const getPropsModel = () => model.propsModel
	const getStructureModelComp = (compId: string) => model.structureModel[getFullId(compId)]

	const getParentId = (compId: string) => {
		const fullCompId = getFullId(compId)
		return _.findKey(getStructureModel(), ({ components, slots }) => {
			return (components && components.includes(fullCompId)) || (slots && Object.values(slots).includes(fullCompId))
		})
	}

	const getCompType = (compId: string): string => {
		const { componentType } = getStructureModelComp(compId)
		return componentType
	}

	const renderedServiceApi = RenderedAPI({ model, getCompType, getParentId })

	const getPageIdByCompId = (compId: string) => (model.rawMasterPageStructure[compId] ? MasterPageId : bootstrapData.currentPageId)
	const getConnectionsByCompId = (controllerId: string, compId: string) => _.get(model.platformModel.connections, [controllerId, compId], [])
	const getCompIdByWixCodeNickname = (nickname: string) => _.get(getConnectionsByCompId('wixCode', nickname), [0, 'compId'])
	const getApplications = () => applications

	const getControllerTypeByCompId = (controllerCompId: string) => {
		const compId = getFullId(controllerCompId)
		const appControllers = _.find(getApplications(), (controllers) => !!controllers[compId])
		return _.get(appControllers, [compId, 'controllerType'], '')
	}
	const getRepeaterIdByCompId = (compId: string) => model.platformModel.compIdToRepeaterId[compId]
	const getControllerConnections = (controllerId: string) => _.get(model.platformModel.connections, [controllerId], {})
	const getRoleForCompId = (compId: string, controllerCompId: string) => {
		const templateId = getFullId(compId)
		return _.findKey(getControllerConnections(controllerCompId), (connections: Array<Connection>) => connections.some((connection: Connection) => connection.compId === templateId))
	}
	const isRepeaterTemplate = (compId: string) => {
		const { templateCompId, scope } = getTemplateCompIdAndRepeaterScope(compId)
		const scopeLength = scope.length

		let repeaterAncestor = getRepeaterIdByCompId(templateCompId)
		let repeaterAncestorsCount = 0
		while (repeaterAncestor && repeaterAncestorsCount <= scopeLength) {
			repeaterAncestorsCount++
			repeaterAncestor = getRepeaterIdByCompId(repeaterAncestor)
		}

		return repeaterAncestorsCount > scopeLength
	}

	const { pagesToShowSosp, controllersInSosp } = model.platformModel.sosp
	const isSospShownOnPage = pagesToShowSosp[bootstrapData.currentPageId]

	const applications = _(model.platformModel.applications)
		.mapValues((controllers) => {
			return isSospShownOnPage ? controllers : _.pickBy(controllers, ({ compId }) => !controllersInSosp[compId])
		})
		.pickBy((controllers, appDefinitionId) => !bootstrapData.disabledPlatformApps[appDefinitionId] && !_.isEmpty(controllers))
		.value() as PlatformModel['applications']

	const getCompProps = (compId: string) => model.propsModel[compId]

	const getRepeaterAncetorsChain = (compId: string, skipNesting?: number): Array<string> => {
		const ancestorsChain = []
		let skipped = 0
		while (compId) {
			const repeaterAncestor = getRepeaterIdByCompId(compId)
			if (!repeaterAncestor) {
				break
			}
			if (skipNesting && skipped < skipNesting) {
				skipped++
			} else {
				ancestorsChain.unshift(repeaterAncestor)
			}

			compId = repeaterAncestor
		}

		return ancestorsChain
	}

	const getDisplayedByAncestorChain = (templateCompId: string, ancestorChainOutermostFirst: Array<string>, innerScope?: string): Array<string> => {
		if (!ancestorChainOutermostFirst.length) {
			return []
		}
		const displayed = ancestorChainOutermostFirst.reduce((outerItems: Array<string>, repeater, index: number) => {
			// outermost
			if (index === 0) {
				return getRepeaterItemsFromProps(repeater, getCompProps, shouldInflateRepeaterItemsInRender) || []
			} else {
				const repeaterInstances: Array<string> = []
				outerItems.forEach((outerItem) => {
					const currentRepeaterInstanceId = getDisplayedId(repeater, outerItem)
					repeaterInstances.push(currentRepeaterInstanceId)
				})
				const currentRepeaterInstancesItems = repeaterInstances.map((repeaterId) => getRepeaterItemsFromProps(repeaterId, getCompProps, shouldInflateRepeaterItemsInRender) || [])
				// flatMap because Array.flat is not supported by Edge18
				return currentRepeaterInstancesItems.flatMap((item) => item)
			}
		}, [])
		return displayed.map((item) => getDisplayedId(innerScope ? getDisplayedId(templateCompId, innerScope) : templateCompId, item))
	}
	// This might not work for more then 2 levels deep. need to check.
	const getDisplayedIdsOfRepeaterTemplate = (compId: string) => {
		const { templateCompId, scope: innerScope } = getTemplateCompIdAndRepeaterScope(compId)
		const compNestingLevel = innerScope.length
		const scopedAncestorChain = getRepeaterAncetorsChain(templateCompId, compNestingLevel)
		// we already have the context of the outer repeaters in 'scope'. so we want to get
		// the inner more repeaters in the scope of the outer repeaters.
		if (!scopedAncestorChain.length) {
			return []
		}
		const scopedSuffix = compNestingLevel ? innerScope.join(REPEATER_DELIMITER) : ''
		const displayedIds = getDisplayedByAncestorChain(templateCompId, scopedAncestorChain, scopedSuffix)
		return displayedIds
	}

	const getOnLoadProperties = (compId: string): { hiddenOnLoad: boolean; collapseOnLoad: boolean } => {
		if (isDisplayedOnly(compId)) {
			return getOnLoadProperties(getFullId(compId))
		}
		const { hiddenOnLoad, collapseOnLoad } = model.platformModel.onLoadProperties[compId] || {}
		return {
			hiddenOnLoad: Boolean(hiddenOnLoad),
			collapseOnLoad: Boolean(collapseOnLoad),
		}
	}

	const updateDisplayedIdPropsFromTemplate = (compId: string) => {
		if (isDisplayedOnly(compId) && !model.propsModel[compId]) {
			model.propsModel[compId] = _.cloneDeep(model.propsModel[getFullId(compId)])
		}
	}

	const clearProps = (compId: string) => {
		delete model.propsModel[compId]
	}

	const updateProps = (compId: string, props: unknown) => {
		updateDisplayedIdPropsFromTemplate(compId)
		if (!model.propsModel[compId]) {
			model.propsModel[compId] = {}
		}
		_.assign(model.propsModel[compId], props)
	}

	// when specs.thunderbolt.deprecateAppId off, the applications is keyed by appID, when on, by appDefId
	const getAppDefinitionIds = () => Object.keys(applications)

	const getApplicationIdOfController = (controllerCompId: string) => {
		const controllerId = getFullId(controllerCompId)
		return _.findKey(applications, (controllers) => controllers[controllerId])
	}

	const getCompSdkData = (compId: string) => {
		if (isDisplayedOnly(compId)) {
			return model.platformModel.sdkData[compId] || model.platformModel.sdkData[getFullId(compId)]
		}
		return model.platformModel.sdkData[compId]
	}

	const getContainerChildrenIds = (compId: string) => {
		if (isDisplayedOnly(compId)) {
			const childrenIds = model.platformModel.containersChildrenIds[getFullId(compId)] || []
			return childrenIds.map((id) => getDisplayedId(id, getTemplateItemId(compId)))
		}
		return model.platformModel.containersChildrenIds[compId] || []
	}

	const getSlotByName = (compId: string, slotName: string) => {
		if (isDisplayedOnly(compId)) {
			const fullId = getFullId(compId)
			const itemId = getTemplateItemId(compId)
			return getDisplayedId(model.platformModel.slots[fullId]?.[slotName], itemId)
		}
		return model.platformModel.slots[compId]?.[slotName]
	}

	const getSlots = () => model.platformModel.slots

	const getSlotsToWidgets = () => {
		return _.reduce(
			model.platformModel.slots,
			(slotsToWidgets, slotsByComp) =>
				slotsToWidgets.concat(
					_.map(slotsByComp, (slotId, slotName) => ({
						slotId,
						slotName,
						widgetId: getControllerTypeByCompId(slotId),
					})),
					[]
				),
			[] as Array<{ slotName: string; widgetId: string; slotId: string }>
		)
	}

	const isDatabindingController = (controllerCompId: string) => !!model.platformModel.applications.dataBinding?.[controllerCompId]

	const findClosestParentIdWithRole = (compId: string, controllerCompId: string) => {
		let parentId = getParentId(compId) as string
		while (parentId) {
			// dbsm needs a way to get parent even if the controller does not have connection to the parent. see TB-2546 for more info
			// https://github.com/wix-private/js-wixcode-sdk/blob/a6a20a4e5075b9837692e933a007100127955476/js/modules/ui/Node.es6#L109 for bolt implementation
			const parentRole = getRoleForCompId(parentId, controllerCompId) || (isDatabindingController(controllerCompId) && getRoleForCompId(parentId, 'wixCode'))
			if (!parentRole) {
				parentId = getParentId(parentId) as string
			} else {
				break // found the parent role
			}
		}
		return parentId
	}

	const getWixCodeConnectionByCompId = (compId: string) => getConnectionsByCompId('wixCode', compId)[0] // there is always one wixCode connection per compId

	const getRepeatedControllers = (repeaterId: string) => {
		return _.reduce(
			getApplications(),
			(apps, appControllers, appDefinitionId) => {
				const appControllersInRepeater = _.filter(appControllers, (controller) => getRepeaterIdByCompId(controller.compId) === repeaterId)
				if (!_.isEmpty(appControllersInRepeater)) {
					apps[appDefinitionId] = _.keyBy(appControllersInRepeater, (controller) => controller.compId)
				}
				return apps
			},
			{} as PlatformModel['applications']
		)
	}

	const hasResponsiveLayout = (compId: string): boolean => {
		return model.platformModel.responsiveCompsInClassic[compId]
	}

	const allControllersOnPageAreGhosts = () => model.platformModel.allControllersOnPageAreGhosts

	const getEffectsByCompId = (compId: string): Array<string> => {
		return model.pageConfig.triggersAndReactions?.compsToEffects[compId] || []
	}

	const isFeatureEnabledOnPage = (featureName: FeatureName) => model.pageFeatures.includes(featureName)
	const isFeatureEnabledOnMasterPage = (featureName: FeatureName) => model.masterPageFeatures.includes(featureName)

	return {
		getEffectsByCompId,
		isFeatureEnabledOnPage,
		isFeatureEnabledOnMasterPage,
		getAllConnections: () => model.platformModel.connections,
		getApplications,
		getAppDefinitionIds,
		getApplicationIdOfController,
		getCompIdByWixCodeNickname,
		getCompIdConnections: () => model.platformModel.compIdConnections,
		getCompProps,
		getCompSdkData,
		getCompType,
		getConnectionsByCompId,
		getContainerChildrenIds,
		getControllerConnections,
		getControllerConfigs: () => model.platformModel.controllerConfigs,
		updateControllerConfig(appDefinitionId, controllerId, config) {
			model.platformModel.controllerConfigs[appDefinitionId][controllerId] = config
		},
		getRepeatedControllersConfigs: (appDefinitionId, templateControllerCompId) => {
			const repeatedControllerPrefix = `${templateControllerCompId}${REPEATER_DELIMITER}`
			return _.pickBy(model.platformModel.controllerConfigs[appDefinitionId], (__, controllerCompId) => controllerCompId.startsWith(repeatedControllerPrefix))
		},
		getControllerTypeByCompId,
		getControllers: () => model.platformModel.orderedControllers,
		getDisplayedIdsOfRepeaterTemplate,
		getFeatureMasterPageConfig: (feature: FeatureName) => model.masterPageConfig[feature] || {},
		getFeaturePageConfig: (feature: FeatureName) => model.pageConfig[feature] || {},
		getOnLoadProperties,
		getPageIdByCompId,
		getParentId,
		getSlotByName,
		getSlots,
		getSlotsToWidgets,
		getRepeaterIdByCompId,
		getRoleForCompId,
		getStaticEvents: () => model.platformModel.staticEvents,
		getStructureModel,
		getStructureModelComp,
		getPropsModel,
		isRepeaterTemplate,
		isController: (compId) => model.platformModel.orderedControllers.includes(compId),
		isRendered: (compId) => renderedServiceApi.isRendered(compId),
		findClosestParentIdWithRole,
		getWixCodeConnectionByCompId,
		hasTPAComponentOnPage: () => model.platformModel.hasTPAComponentOnPage,
		hasResponsiveLayout,
		getRepeatedControllers,
		clearProps,
		allControllersOnPageAreGhosts,
		hasBlocksWidgetOnPage: () => model.platformModel.hasBlocksWidgetOnPage,
		updateProps,
		updateDisplayedIdPropsFromTemplate,
		updateConnections: (connections) => {
			model.platformModel.connections = connections
		},
		updateStructure: (components) => {
			model.structureModel = components
		},
		updateCompIdConnections: (compIdConnections) => {
			model.platformModel.compIdConnections = compIdConnections
		},
		updateOrderedControllers: (orderedControllers) => {
			model.platformModel.orderedControllers = orderedControllers
		},
		getPublicAppData: (appDefinitionId) => model.platformModel.applicationsPublicData[appDefinitionId],
	}
}
