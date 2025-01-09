import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	ILogger,
	IPageDidMountHandler,
	IStructureAPI,
	LoggerSymbol,
	PageFeatureConfigSymbol,
	StructureAPI,
} from '@wix/thunderbolt-symbols'
import { name } from './symbols'
import { ComponentsPageConfig } from './types'

export const ComponentsUnderFold = withDependencies(
	[named(PageFeatureConfigSymbol, name), LoggerSymbol, StructureAPI],
	(
		{ componentsUnderFoldMap }: ComponentsPageConfig,
		logger: ILogger,
		structureApi: IStructureAPI
	): IPageDidMountHandler => {
		return {
			pageDidMount() {
				const widgetIdsUnderFold: Record<string, boolean> = {}
				const compTypesUnderFold: Record<string, boolean> = {}
				Object.values(componentsUnderFoldMap).forEach((comp) => {
					const { componentType, compId } = comp
					if (comp.widgetId) {
						widgetIdsUnderFold[comp.widgetId] = true
						return
					}
					let viewerComponentType = componentType
					const compStructure = structureApi.get(compId)
					if (compStructure) {
						const { componentType: viewerType, uiType } = compStructure
						viewerComponentType = uiType ? `${viewerType}_${uiType}` : viewerType
					}
					compTypesUnderFold[viewerComponentType] = true
				})
				logger.meter('components-under-fold', {
					customParams: {
						compTypesUnderFold: Object.keys(compTypesUnderFold),
						widgetIdsUnderFold: Object.keys(widgetIdsUnderFold),
					},
				})
			},
		}
	}
)
