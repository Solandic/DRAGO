import { interpolate, getProperties as templateGetProperties } from './svgFiltersTemplates'
import { FilterOverridesOrEmpty, SvgShadow } from './typing'
import { filterPresets } from './svgPresets'

function getFilter(id: string, name: string, overrides: FilterOverridesOrEmpty, attrs: any) {
	const filter = filterPresets[name] || []
	return interpolate(id, filter, overrides || {}, attrs)
}

function getShadow(id: string, shadow: SvgShadow) {
	return interpolate(id, [{ key: 'shadow', value: shadow }], {})
}

function getProperties(name: string, overrides: FilterOverridesOrEmpty) {
	const filter = filterPresets[name] || []
	return templateGetProperties(filter, overrides || {})
}

function isFilterExists(effectName: string) {
	return effectName in filterPresets
}

export { getFilter, getShadow, getProperties, isFilterExists }
