import { WidgetData } from '@wix/thunderbolt-symbols'
import { DSCarmiRenderFlags } from '@wix/thunderbolt-becky-types'

type WidgetSpecData = WidgetData[string]
const getComponentField = <T extends keyof WidgetSpecData['componentFields']>(
	widgetSpec: WidgetSpecData,
	fieldName: T
): WidgetSpecData['componentFields'][T] => widgetSpec?.componentFields?.[fieldName]
export const isOOI: (params: {
	widgetSpec: WidgetData[string]
	isMigratingToOoi: boolean
	componentViewMode?: DSCarmiRenderFlags['componentViewMode']
	isLivePreviewOpenForEditor?: boolean
	isAdi?: boolean
}) => boolean = ({
	widgetSpec,
	isMigratingToOoi,
	componentViewMode,
	isLivePreviewOpenForEditor = false,
	isAdi = false,
}): boolean => {
	const hasComponentUrl = !!getComponentField(widgetSpec, 'componentUrl')
	const isOOIEligible = hasComponentUrl || isMigratingToOoi

	const isPublic = componentViewMode === undefined

	if (isPublic) {
		return isOOIEligible
	} else {
		const shouldRenderAsOOIInEditor =
			componentViewMode === 'preview' ||
			(isLivePreviewOpenForEditor &&
				getComponentField(widgetSpec, 'ooiInEditor') &&
				isLivePreviewOpenForEditor) ||
			(isLivePreviewOpenForEditor && getComponentField(widgetSpec, 'ooiInEditorOnThunderbolt') && !isAdi) // todo - adi is dead right?

		return isOOIEligible && shouldRenderAsOOIInEditor
	}
}
