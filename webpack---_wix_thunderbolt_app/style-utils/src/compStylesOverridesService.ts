import { StyleUtils, StyleUtilsConfig } from './types'

const collapsedStyles = {
	visibility: 'hidden !important',
	overflow: 'hidden !important',
	height: '0 !important',
	width: '0 !important',
	'min-width': '0 !important',
	'min-height': '0 !important',
	'margin-bottom': '0 !important',
	'margin-left': '0 !important',
	'margin-right': '0 !important',
	padding: '0 !important',
} as const

const responsiveCollapsedStyles = {
	...collapsedStyles,
	position: 'absolute !important',
	'margin-top': '0 !important',
} as const

const expandedStyles = {
	visibility: null,
	overflow: null,
	height: null,
	width: null,
	'min-width': null,
	'min-height': null,
	'margin-bottom': null,
	'margin-left': null,
	'margin-right': null,
	padding: null,
} as const

const responsiveExpandedStyles = {
	...expandedStyles,
	position: null,
	'margin-top': null,
} as const

const hiddenStyles = {
	visibility: 'hidden !important',
} as const

const shownStyles = {
	visibility: null,
} as const

export const createStyleUtils = ({ isResponsive }: StyleUtilsConfig): StyleUtils => ({
	getCollapsedStyles: () => (isResponsive ? responsiveCollapsedStyles : collapsedStyles),
	getExpandedStyles: () => (isResponsive ? responsiveExpandedStyles : expandedStyles),
	getHiddenStyles: () => hiddenStyles,
	getShownStyles: () => shownStyles,
})
