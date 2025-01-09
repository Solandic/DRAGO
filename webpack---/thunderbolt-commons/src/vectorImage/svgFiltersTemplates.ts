import {
	FilterDefinitionSvgShadow,
	FilterDefinitionNumber,
	FilterDefinition,
	FilterDefinitionString,
	FilterDefinitionIdentity,
	FilterDefinitionLuma,
	DuotoneValue,
	FilterOverrides,
	FilterOverridesOrEmpty,
} from './typing'
import {
	getDoutone,
	hex2RgbNorm,
	getColor,
	getContrast,
	getSepia,
	getBrightness,
	getTint,
	getAlpha,
	getLumaMatrix,
} from './svgFiltersParts'

function attrToString(key: string, value: any) {
	return value || value === 0 ? `${key}="${value}"` : ''
}
function attrsObjectToString(attrs: any) {
	return Object.keys(attrs)
		.map((key) => attrToString(key, attrs[key]))
		.join(' ')
}

function filterWrapperTemplate({ id, content, attrs = {} }: { id: string; content: string; attrs?: any }) {
	// the redundant identity <feComponentTransfer/> in start and end
	// are for fixing old Webkit bug that caused it to ignore color-interpolation-filters="sRGB"
	return `<filter id="${id}" color-interpolation-filters="sRGB" ${attrsObjectToString(attrs)}>
    <feComponentTransfer result="srcRGB"/>
    ${content}
    <feComponentTransfer/>
</filter>`
}

function identity({ inAttr }: FilterDefinitionIdentityArg) {
	return `<feColorMatrix ${attrToString('in', inAttr)}/>`
}

function contrast({ value }: FilterDefinitionNumberArg) {
	return `<feComponentTransfer>${getContrast(value)}</feComponentTransfer>`
}

function brightness({ value, result }: FilterDefinitionNumberArg) {
	return `<feComponentTransfer ${attrToString('result', result)}>${getBrightness(value)}</feComponentTransfer>`
}

function saturation({ value, inAttr, result }: FilterDefinitionNumberArg) {
	return `<feColorMatrix type="saturate" values="${value}" ${inAttr ? `in="${inAttr}"` : ''}${
		result ? `result="${result}"` : ''
	}/>`
}

function sepia({ value }: FilterDefinitionNumberArg) {
	return `<feColorMatrix type="matrix" values="${getSepia(value)}"/>`
}

function hue({ value }: FilterDefinitionNumberArg) {
	return `<feColorMatrix type="hueRotate" values="${value}"/>`
}

function color({ value, inAttr, result }: FilterDefinitionSvgShadowArg | FilterDefinitionStringArg) {
	const hexColor = typeof value === 'string' ? value : value.color
	const opacity = typeof value === 'object' && typeof value.opacity !== 'undefined' ? value.opacity : 1
	return `<feColorMatrix type="matrix" values="${getColor(hex2RgbNorm(hexColor!), opacity)}" ${
		inAttr ? `in="${inAttr}"` : ''
	}${result ? `result="${result}"` : ''}/>`
}

function tint({ value }: FilterDefinitionStringArg) {
	return `<feColorMatrix type="matrix" values="${getTint(hex2RgbNorm(value))}"/>`
}

function blur({ value, inAttr }: FilterDefinitionNumberArg) {
	return `<feGaussianBlur stdDeviation="${value}" ${inAttr ? `in="${inAttr}"` : ''}/>`
}

function alpha({ value, inAttr, result }: FilterDefinitionNumberArg) {
	return `<feComponentTransfer ${attrToString('in', inAttr)} ${attrToString('result', result)}>${getAlpha(
		value
	)}</feComponentTransfer>`
}

function offset({ value, inAttr, result }: FilterDefinitionSvgShadowArg) {
	return `<feOffset dx="${value.x}" dy="${value.y}" ${inAttr ? `in="${inAttr}"` : ''}${
		result ? `result="${result}"` : ''
	}/>`
}

function blend({ value, inAttr, in2Attr, result }: FilterDefinitionStringArg) {
	return `<feBlend mode="${value}" in="${inAttr}" in2="${in2Attr}" ${attrToString('result', result)}/>`
}

function composite({ value, inAttr, in2Attr, result }: FilterDefinitionStringArg) {
	return `<feComposite operator="${value}" in="${inAttr}" in2="${in2Attr}" ${attrToString('result', result)}/>`
}

function duotone({ value: { dark, light }, inAttr, result }: FilterDefinitionSvgShadowArg) {
	return `${saturation({ value: 0 })}
<feColorMatrix type="matrix" values="${getDoutone(hex2RgbNorm(light!), hex2RgbNorm(dark!))}" ${
		inAttr ? `in="${inAttr}"` : ''
	}${result ? `result="${result}"` : ''}/>`
}

function luma({ value: { dark, light }, result }: FilterDefinitionLumaArg) {
	return `<feColorMatrix type="matrix" values="${getLumaMatrix(light, dark)}" ${result ? `result="${result}"` : ''}/>`
}

function shadow({ value: { blurRadius, mergeGraphic, ...rest } }: FilterDefinitionSvgShadowArg) {
	return `${blur({ value: blurRadius!, inAttr: 'SourceAlpha' })}
${offset({ value: rest })}
${color({ value: rest })}
${
	mergeGraphic
		? `<feMerge>
    <feMergeNode/>
    <feMergeNode in="SourceGraphic"/>
</feMerge>`
		: ''
}`
}

type FilterDefinitionIdentityArg = Omit<FilterDefinitionIdentity, 'key'>
type FilterDefinitionLumaArg = Omit<FilterDefinitionLuma, 'key'>

type FilterDefinitionNumberArg = Omit<FilterDefinitionNumber, 'key'>
const filterComponentTempaltesWithNumber: Record<
	FilterDefinitionNumber['key'],
	(arg: FilterDefinitionNumberArg) => string
> = {
	blur,
	saturation,
	contrast,
	brightness,
	sepia,
	hue,
	alpha,
}

type FilterDefinitionStringArg = Omit<FilterDefinitionString, 'key'>
const filterComponentTempaltesWithString: Record<
	FilterDefinitionString['key'],
	(arg: FilterDefinitionStringArg) => string
> = {
	blend,
	color,
	composite,
	tint,
}

type FilterDefinitionSvgShadowArg = Omit<FilterDefinitionSvgShadow, 'key'>
const filterComponentTempaltes: Record<
	FilterDefinitionSvgShadow['key'],
	(arg: FilterDefinitionSvgShadowArg) => string
> = {
	duotone,
	shadow,
	color,
	offset,
}

function getFilterValue(
	key: FilterDefinition['key'],
	value: FilterDefinition['value'],
	overrides: FilterOverridesOrEmpty
) {
	if (key === 'duotone') {
		return {
			light: ('duotoneLight' in overrides && overrides.duotoneLight) || (value as DuotoneValue).light,
			dark: ('duotoneDark' in overrides && overrides.duotoneDark) || (value as DuotoneValue).dark,
		}
	} else if (key in overrides) {
		return (overrides as FilterOverrides)[key]
	}
	return value
}

function interpolate(
	id: string,
	filterDefinition: Array<FilterDefinition>,
	overrides: FilterOverridesOrEmpty,
	attrs?: any
) {
	const content = filterDefinition
		.map((effect) => {
			const { key, value } = effect
			const filterValue = getFilterValue(key, value, overrides)
			const arg = { ...effect, value: filterValue }
			if (typeof filterValue === 'number') {
				return filterComponentTempaltesWithNumber[key as FilterDefinitionNumber['key']](
					arg as FilterDefinitionNumber
				)
			} else if (typeof filterValue === 'string') {
				return filterComponentTempaltesWithString[key as FilterDefinitionString['key']](
					arg as FilterDefinitionString
				)
			} else if (key === 'luma') {
				return luma(arg as FilterDefinitionLumaArg)
			} else if (key === 'identity') {
				return identity(arg as FilterDefinitionIdentityArg)
			} else {
				return filterComponentTempaltes[key as FilterDefinitionSvgShadow['key']](
					arg as FilterDefinitionSvgShadow
				)
			}
		})
		.join('\n')
	return filterWrapperTemplate({ id, content, attrs })
}

function getProperties(filterDefinition: Array<FilterDefinition>, overrides: FilterOverridesOrEmpty) {
	return filterDefinition.map((effect) => {
		const { key, value } = effect
		return { [key]: getFilterValue(key, value, overrides) }
	})
}

export { interpolate, getProperties }
