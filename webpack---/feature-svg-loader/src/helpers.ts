import { SvgInfo, vectorImage } from '@wix/thunderbolt-commons'
import { SvgLoaderComponentTypes, SvgLoaderProps, SvgStringPropKeys, SvgStringResultAndInfo } from './types'
import { SVG_TYPES } from './constants'
import { IPropsStore } from '@wix/thunderbolt-symbols'

export const updateSvgProps = (compId: string, svgLoaderProps: SvgLoaderProps, propsStore: IPropsStore) => {
	propsStore.update<Record<string, SvgLoaderProps>>({
		[compId]: svgLoaderProps,
	})
}

export const getSvgContentAndInfoFromDom = (compId: string): SvgStringResultAndInfo | null => {
	const compElement = window?.document?.getElementById(compId)
	if (!compElement) {
		return null
	}
	const svgElement = compElement.querySelector('svg')

	if (!svgElement || !svgElement.parentElement?.innerHTML) {
		return null
	}

	const svgStringResult = svgElement.parentElement.innerHTML
	const { info: svgInfo } = vectorImage.parseSvgString(svgStringResult)

	return {
		svgStringResult,
		svgInfo,
	}
}

const isUGCtype = ({ svgType }: SvgInfo) => svgType === SVG_TYPES.UGC

/**
 * Some components use different prop names for the svg string content.
 */
const getSvgPropKeyFromCompType = (compType: SvgLoaderComponentTypes): SvgStringPropKeys => {
	switch (compType) {
		case 'VectorImage':
			return 'svgContent'
		case 'Breadcrumbs':
			return 'svgString'
		default:
			console.error(`Passing an unsupported component type to svgLoader: ${compType}`)
			return 'svgContent'
	}
}

export const createSvgProps = (
	componentType: SvgLoaderComponentTypes,
	{ svgStringResult, svgInfo }: SvgStringResultAndInfo
) => {
	const svgStringPropName = getSvgPropKeyFromCompType(componentType)
	const shouldScaleStroke = svgInfo ? { shouldScaleStroke: isUGCtype(svgInfo) } : {}

	return {
		[svgStringPropName]: svgStringResult,
		...shouldScaleStroke, // only update shouldScaleStroke if svgInfo is was passed
	} as SvgLoaderProps
}
