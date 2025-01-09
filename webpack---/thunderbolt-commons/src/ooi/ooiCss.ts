import {
	getComponentCssVariables,
	getProcessedCssWithConfig,
	getSiteCssVariables,
	getBuildTimeStaticCss,
} from '@wix/tpa-style-webpack-plugin/standalone'
import type { OOICssConfig } from '@wix/thunderbolt-becky-types'
import type { TextPresetFontObject } from '../textPresets'
import type { StyleParams } from '@wix/thunderbolt-symbols'

type StyleData = {
	siteColors: Array<{ name: string; value: string; reference: string }>
	siteTextPresets: Record<string, TextPresetFontObject>
	style: StyleParams
}

type TpaStylePluginOptions = {
	isRTL: boolean
	isMobile: boolean
	dimensions: {
		width: number | ''
		height: number | ''
	}
	prefixSelector: string
	usesCssPerBreakpoint: boolean
}

const generateCssVars = ({
	styleData,
	prefixSelector,
	options,
	cssConfig,
	tpaData,
}: {
	styleData: StyleData
	prefixSelector: string
	options: TpaStylePluginOptions & {
		dimensions: {
			width: number
			height: number
		}
	}
	cssConfig: OOICssConfig
	tpaData: any
}) => {
	const { siteColors, siteTextPresets, style: styleParams } = styleData
	const siteCssVars = getSiteCssVariables(siteColors, siteTextPresets)
	const customExpressions = {} // custom json per app->widget
	const widgetCssVars = getComponentCssVariables(
		{ siteColors, siteTextPresets, styleParams },
		customExpressions,
		{},
		options,
		cssConfig.defaults,
		cssConfig.customCssVars,
		tpaData
	)
	return `${prefixSelector} {
				${widgetCssVars.stylesheet}
				${siteCssVars.stylesheet}
		}`
}

export const processOoiCss = ({
	widgetId,
	styleData,
	prefixSelector,
	cssConfig,
	isRTL,
	isMobile,
	dimensions,
	usesCssPerBreakpoint,
	shouldRemoveStaticCss = false,
	getStaticCss = (cssconfig) => getBuildTimeStaticCss(cssconfig).css,
	runAndReport = (syncMethod, _) => syncMethod(),
	tpaData,
	isResponsive,
}: TpaStylePluginOptions & {
	widgetId: string
	styleData: StyleData
	prefixSelector: string
	cssConfig?: OOICssConfig
	shouldRemoveStaticCss?: boolean
	getStaticCss?: (cssConfig: OOICssConfig) => string
	runAndReport?<T>(syncMethod: () => T, methodName: string): T
	tpaData: any
	isResponsive?: boolean
}): string => {
	if (!cssConfig) {
		return ''
	}
	const options = { isRTL, isMobile, prefixSelector, usesCssPerBreakpoint, dimensions } as TpaStylePluginOptions & {
		dimensions: {
			width: number
			height: number
		}
	}
	const cssVars = generateCssVars({ styleData, prefixSelector, cssConfig, options, tpaData })

	const cssConfigCss = runAndReport(
		() =>
			getProcessedCssWithConfig(
				cssConfig,
				{
					siteColors: styleData.siteColors,
					siteTextPresets: styleData.siteTextPresets,
					styleParams: styleData.style,
				},
				options
			),
		`getProcessedCssWithConfig${isResponsive ? '-Responsive' : ''}-${widgetId}`
	)
	const staticCss = shouldRemoveStaticCss ? '' : runAndReport(() => getStaticCss(cssConfig), 'staticCssProcessor')
	return cssVars + staticCss + cssConfigCss
}
