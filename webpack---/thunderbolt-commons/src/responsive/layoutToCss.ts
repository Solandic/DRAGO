import {
	assign,
	defaults,
	forEach,
	get,
	isNumber,
	isObject,
	kebabCase,
	map,
	mapKeys,
	merge,
	omitBy,
	pickBy,
	reduce,
} from 'lodash'

import type {
	AspectRatioSize,
	Calculation,
	ClassicComponentLayout,
	ComponentLayout,
	FixedPositionItemLayout,
	FlexContainerLayouts,
	FlexItemLayouts,
	GridContainerLayout,
	GridItemLayout,
	GridItemLayouts,
	KeywordSize,
	LayoutDataItems,
	Margins,
	MeshItemLayout,
	MinMaxSize,
	Padding,
	Refable,
	RefableAlignment,
	RefableJustifyContent,
	RefableNumber,
	Repeat,
	ScrollBehaviour,
	ScrollSnap,
	ScrollSnapAlign,
	SingleLayoutData,
	Size,
	Spx,
	TypeMapping,
	UnitSize,
	VariableReference,
	MultiColumnsItemLayout,
	MultiColumnsContainerLayout,
	RefablePosition,
	AdditionalLayoutProperties,
	CssObject,
	SelectorToCssMap,
} from '@wix/thunderbolt-becky-types'
import {
	flexAlignmentToString,
	flexJustifyContentToString,
	gridAlignmentToString,
	meshAlignmentToString,
	numberToString,
	unitSizeToString,
} from './layoutValuesToCss'
import { variableNameGetters } from './variablesToCss'
import { resolveSpxAttribute } from '../css'
import { Experiments } from '@wix/document-services-types'

export const isUnitSize = (u: Size): u is UnitSize =>
	u.type === 'px' ||
	u.type === 'percentage' ||
	u.type === 'vw' ||
	u.type === 'vh' ||
	u.type === 'fr' ||
	u.type === 'rem' ||
	u.type === 'spx' ||
	u.type === 'cqw' ||
	u.type === 'cqh' ||
	u.type === 'number'
export const isAutoSize = (u: Size): u is KeywordSize => u.type === 'auto'
export const isKeywordSize = (u: Size): u is KeywordSize =>
	u.type === 'auto' || u.type === 'maxContent' || u.type === 'minContent' || u.type === 'unset'
export const isMinMaxSize = (u: Size): u is MinMaxSize => u.type === 'MinMaxSize'
export const isAspectRatio = (u: Size): u is AspectRatioSize => u.type === 'aspectRatio'

// const isCssVariableSize = (u: Size): u is Var => u.type === 'var'
export const isCalculationSize = (u: Size): u is Calculation => u.type === 'Calc'

const isRepeat = (u: Size): u is Repeat => u.type === 'Repeat'

const getVariableKey = (variable: VariableReference): string => {
	const variableId = variable.variableId.replace('#', '')

	if (variable.shouldRenderVariableName) {
		return variable.variableName ?? variableId
	}

	return variableId
}

export const sizeToString = (size: Size | undefined | null, spx?: Spx): string => {
	if (!size) {
		return ''
	}

	if (isUnitSize(size)) {
		return unitSizeToString(size, spx)
	}

	if (isKeywordSize(size)) {
		let type: string = size.type

		switch (size.type) {
			case 'maxContent':
				type = 'max-content'
				break
			case 'minContent':
				type = 'min-content'
				break
			default:
				break
		}

		return type
	}

	if (isMinMaxSize(size)) {
		return `minmax(${sizeToString(size.min, spx)},${sizeToString(size.max, spx)})`
	}

	if (isCalculationSize(size)) {
		return `calc(${resolveSpxAttribute(size.value, spx, true)})`
	}

	if (isRepeat(size)) {
		const length = isVariableRef(size.length)
			? `var(${variableNameGetters.repeatLength.get(getVariableKey(size.length))})`
			: size.length

		return `repeat(${length}, ${size.value.map((value) => sizeToString(value)).join(' ')})`
	}

	if (isAspectRatio(size)) {
		return 'auto'
	}

	if (size.type === 'VariableReference') {
		return `var(${variableNameGetters.unitSize.get(getVariableKey(size))})`
	}

	if (size.type === 'SystemVariable') {
		if (size.value === 'siteWidth') {
			return `var(--site-width)`
		}

		if (size.value === 'topBannerHeight') {
			return `var(--wix-ads-height)`
		}
	}

	if (size.type === 'StretchWithSoftMargins') {
		const marginLeftCss = sizeToString(size.value.margins.left)
		const marginRightCss = sizeToString(size.value.margins.right)
		return `calc(100% - ${marginLeftCss} - ${marginRightCss})`
	}

	throw new Error(`error parsing size: ${JSON.stringify(size)}`)
}

export const marginsToCss = (margins?: Margins): CssObject => ({
	...(margins?.top && {
		'margin-top': sizeToString(margins.top),
	}),
	...(margins?.bottom && {
		'margin-bottom': sizeToString(margins.bottom),
	}),
	...(margins?.right && {
		'margin-right': sizeToString(margins.right),
	}),
	...(margins?.left && {
		'margin-left': sizeToString(margins.left),
	}),
})

export const layoutSelectorItem = 'item'
export const layoutSelectorOneCellGrid = 'component-one-cell-grid'
export const layoutSelectorContainer = 'container'
export const layoutSelectorContainerPinned = 'container-pinned'
export const layoutSelectorChildren = 'children'
export const layoutSelectorOverflowWrapper = 'overflow-wrapper'
export const layoutSelectorComponent = 'component'

// This is here in order to make sure every converter returns only after passing through any of the setForX functions below (otherwise it won't work)
interface Hack {
	___notaRealFields___: boolean
}

type TargetedCss = Hack & SelectorToCssMap

const setPrefix = (prefix: string) => (object: SelectorToCssMap) =>
	mapKeys(object, (value, key) => `${prefix}${key}`) as TargetedCss
const setForOverflowWrapper = setPrefix(layoutSelectorOverflowWrapper)
const setForContainer = setPrefix(layoutSelectorContainer)
const setForContainerPinned = setPrefix(layoutSelectorContainerPinned)

const setForOneCellGrid = setPrefix(layoutSelectorOneCellGrid)
const setForItem = setPrefix(layoutSelectorItem)
const setForComponent = setPrefix(layoutSelectorComponent)
const mergeStyles = merge as (...args: Array<TargetedCss>) => TargetedCss

const addKeyPrefixForCssObject = (keyPrefix: string) => (
	cssObject: Partial<Margins | Padding>,
	spx?: Spx
): CssObject => {
	const keys = Object.keys(cssObject) as Array<keyof Margins | keyof Padding>

	return keys.reduce((result, key) => {
		result[`${keyPrefix}${key}`] = sizeToString(cssObject[key], spx)
		return result
	}, {} as CssObject)
}

const buildMargins = addKeyPrefixForCssObject('margin-')

const buildPadding = addKeyPrefixForCssObject('padding-')

const buildScrollSnapAlign = (scrollSnapAlign: ScrollSnapAlign): CssObject => ({
	'scroll-snap-align': scrollSnapAlign,
})
const getTopStringOld = (itemLayout: GridItemLayouts | FlexItemLayouts, spx?: Spx) => {
	const { top, position } = itemLayout
	const topString = sizeToString(top, spx) || '0px'
	const calcValues = [topString]

	if (isVariableRef(position) || position === 'sticky' || position === 'stickyToHeader') {
		calcValues.push('var(--sticky-offset, 0px)')
	}

	if (top && isUnitSize(top) && position === 'stickyToHeader') {
		calcValues.push('var(--top-offset, 0px)')
	}

	return `calc(${calcValues.join(' + ')})`
}
const getTopString = (itemLayout: GridItemLayouts | FlexItemLayouts, spx?: Spx) => {
	const { top, position } = itemLayout
	const topString = sizeToString(top, spx) || '0px'
	const calcValues = [topString]

	if (isVariableRef(position)) {
		const headerOffsetVariableName = variableNameGetters.position.getHeaderOffset(getVariableKey(position))
		const stickyOffsetVariableName = variableNameGetters.position.getStickyOffset(getVariableKey(position))
		calcValues.push(`var(${stickyOffsetVariableName})`, `var(${headerOffsetVariableName})`)
	} else {
		if (position === 'sticky' || position === 'stickyToHeader') {
			calcValues.push('var(--sticky-offset, 0px)')
		}
		if (position === 'stickyToHeader') {
			calcValues.push('var(--top-offset, 0px)')
		}
	}

	return `calc(${calcValues.join(' + ')})`
}

const getPosition = (position?: RefablePosition): string => {
	if (position === 'stickyToHeader') {
		return 'sticky'
	}
	if (isVariableRef(position)) {
		return `var(${variableNameGetters.position.get(getVariableKey(position))})`
	}

	return position || 'absolute'
}

const getOffsetByStickiness = (offsetFallback: string, position: RefablePosition | undefined) => {
	const forceAutoVar = isVariableRef(position)
		? variableNameGetters.position.getForceAuto(getVariableKey(position))
		: '--force-auto'

	return `var(${forceAutoVar},${offsetFallback})`
}

const buildPosition = <T extends GridItemLayouts | FlexItemLayouts>(
	itemLayout: T,
	renderSticky: boolean,
	spx?: Spx,
	experiments?: Experiments
): CssObject => {
	const { position } = itemLayout

	if (!position && !itemLayout.pinnedToContainer) {
		return {}
	}

	const isStickyPosition = position === 'sticky' || position === 'stickyToHeader'

	const emptySize = sizeToString(null)
	const isStickyDisabled = isStickyPosition && !renderSticky
	const shouldForceAuto = isStickyDisabled || itemLayout.position === 'relative'

	const isStickyToHeaderDesignVarSupported =
		experiments && experiments['specs.thunderbolt.supportStickyToHeaderValueForBlocksPositionDesignVar']

	return omitBy(
		{
			position: isStickyDisabled ? 'relative' : getPosition(position),
			'--force-auto': shouldForceAuto ? 'auto' : 'initial',
			top: getOffsetByStickiness(
				isStickyToHeaderDesignVarSupported ? getTopString(itemLayout, spx) : getTopStringOld(itemLayout, spx),
				position
			),
			bottom: getOffsetByStickiness(sizeToString(itemLayout.bottom, spx), position),
			left: getOffsetByStickiness(sizeToString(itemLayout.left, spx), position),
			right: getOffsetByStickiness(sizeToString(itemLayout.right, spx), position),
		},
		(value) => value === emptySize
	)
}

const createItemLayoutConverter = <T extends GridItemLayouts | FlexItemLayouts>(
	specificItemLayoutConverter: (layout: T) => TargetedCss
) => (
	itemLayout: T,
	{ renderSticky, renderScrollSnap, spx }: AdditionalLayoutProperties,
	experiments?: Experiments
) => {
	const specificStyles = specificItemLayoutConverter(itemLayout)
	const baseStyles = setForItem({
		'': Object.assign(
			buildPosition(itemLayout, renderSticky, spx, experiments),
			itemLayout.scrollSnapAlign && renderScrollSnap ? buildScrollSnapAlign(itemLayout.scrollSnapAlign) : {},
			itemLayout.margins ? buildMargins(itemLayout.margins, spx) : {}
		),
	})
	return mergeStyles(baseStyles, specificStyles)
}

const buildScrollStyles = (scrollSnap: ScrollSnap, scrollBehaviour?: ScrollBehaviour): CssObject => ({
	'scroll-snap-type':
		scrollSnap.scrollSnapType === 'none'
			? scrollSnap.scrollSnapType
			: `${scrollSnap.scrollSnapDirection || ''}${
					scrollSnap.scrollSnapType ? ` ${scrollSnap.scrollSnapType}` : ''
			  }`.trim(),
	'-webkit-scroll-snap-type': scrollSnap.scrollSnapType as string,
	'scroll-behavior': scrollBehaviour ? scrollBehaviour : 'auto',
})

const getOverflowStyles = <T extends GridContainerLayout | FlexContainerLayouts | MultiColumnsContainerLayout>(
	containerLayout: T,
	renderScrollSnap: boolean
) => {
	const overflowStyles = assign(
		{},
		containerLayout.overflowX && {
			'overflow-x': containerLayout.overflowX,
		},
		containerLayout.overflowY && {
			'overflow-y': containerLayout.overflowY,
		},
		containerLayout.overflowY === 'scroll' && {
			'--sticky-offset': '0px',
		}
	)
	const scrollSnapStyles =
		containerLayout.scrollSnap && containerLayout.scrollSnap.scrollSnapType && renderScrollSnap
			? buildScrollStyles(containerLayout.scrollSnap, containerLayout.scrollBehaviour)
			: {}

	const hideScrollbarStyles = containerLayout.hideScrollbar
		? {
				'': {
					'scrollbar-width': 'none',
					overflow: '-moz-scrollbars-none',
					'-ms-overflow-style': 'none',
				},
				'::-webkit-scrollbar': {
					width: '0',
					height: '0',
				},
		  }
		: {}

	return merge(
		{
			'': assign(overflowStyles, scrollSnapStyles),
		},
		hideScrollbarStyles
	) as SelectorToCssMap
}

const getOneCellWrapperStyle = (
	shouldOmitWrapperLayers: boolean,
	isOneCellGridDisplayBlock: boolean,
	isOneCellGridDisplayFlex: boolean
) => {
	let oneCellStyle
	if (isOneCellGridDisplayBlock) {
		oneCellStyle = [
			setForOneCellGrid({
				'': {
					display: 'block',
				},
			}),
		]
	} else if (isOneCellGridDisplayFlex) {
		oneCellStyle = !shouldOmitWrapperLayers
			? [
					setForComponent({
						'': { display: 'var(--l_display,var(--comp-display,flex))', 'flex-direction': 'column' },
					}),
					setForContainer({ '': { 'flex-grow': '1' } }),
			  ]
			: []
	} else {
		const oneCellGrid = {
			'': {
				display: 'grid',
				'grid-template-rows': '1fr',
				'grid-template-columns': 'minmax(0, 1fr)',
			},
		}
		oneCellStyle = [setForOneCellGrid(oneCellGrid)]
	}

	return oneCellStyle
}

const getOverflowWrapperStyle = <T extends GridContainerLayout | FlexContainerLayouts | MultiColumnsContainerLayout>(
	containerLayout: T,
	renderScrollSnap: boolean,
	isOneCellGridDisplayBlock: boolean,
	isOneCellGridDisplayFlex: boolean
) => {
	let overflowWrapperStyles
	if (isOneCellGridDisplayBlock) {
		overflowWrapperStyles = {
			'': {
				display: 'block',
				position: 'relative',
				height: '100%', // stretch to root
			},
		}
	} else if (isOneCellGridDisplayFlex) {
		overflowWrapperStyles = {
			'': {
				display: 'flex',
				'flex-direction': 'column',
				'flex-grow': '1',
			},
		}
	} else {
		const oneCellGrid = {
			'': {
				display: 'grid',
				'grid-template-rows': '1fr',
				'grid-template-columns': 'minmax(0, 1fr)',
			},
		}
		overflowWrapperStyles = oneCellGrid
	}

	const containerOverflowStyles = getOverflowStyles(containerLayout, renderScrollSnap)
	return [setForOverflowWrapper(overflowWrapperStyles), setForOverflowWrapper(containerOverflowStyles)]
}

const getContentMaxWidth = (
	containerLayout: GridContainerLayout | FlexContainerLayouts | MultiColumnsContainerLayout,
	spx: Spx | undefined
) => {
	const { contentMaxWidth } = containerLayout || {}
	const maxWidth = contentMaxWidth?.maxWidth
	if (!maxWidth) {
		return {}
	}

	const maxWidthVar = isVariableRef(maxWidth)
		? `var(${variableNameGetters.unitSize.get(maxWidth.variableId)})`
		: sizeToString(maxWidth, spx)

	return {
		'max-width': maxWidthVar,
		'margin-left': getAlignment(contentMaxWidth.align, maxWidthVar),
		'--section-max-width': maxWidthVar,
	}
}

const createContainerLayoutConverter = <
	T extends GridContainerLayout | FlexContainerLayouts | MultiColumnsContainerLayout
>(
	specificItemLayoutConverter: (layout: T, layoutProperties: AdditionalLayoutProperties) => TargetedCss
) => (containerLayout: T, layoutProperties: AdditionalLayoutProperties) => {
	const {
		hasOverflow,
		renderScrollSnap,
		spx,
		isOneCellGridDisplayFlex,
		isOneCellGridDisplayBlock,
		shouldOmitWrapperLayers,
	} = layoutProperties

	const position = !shouldOmitWrapperLayers
		? {
				position: 'relative',
		  }
		: {}
	const padding = containerLayout.padding ? buildPadding(containerLayout.padding, spx) : {}

	const gaps: CssObject = {}
	if (containerLayout.rowGap) {
		gaps['row-gap'] = sizeToString(containerLayout.rowGap, spx)
	}
	if (containerLayout.columnGap) {
		gaps['column-gap'] = sizeToString(containerLayout.columnGap, spx)
	}

	let height = {}
	if (isOneCellGridDisplayBlock) {
		if (hasOverflow) {
			height = { height: 'auto' } // container wrapped by overflow wrapper and by root div - height set by content
		} else if (!shouldOmitWrapperLayers) {
			height = { height: '100%' } // container wrapper by root div - stretch to root
		}
	}

	const contentMaxWidth = getContentMaxWidth(containerLayout, spx)

	const containerStyles = setForContainer({
		'': assign(
			{
				'box-sizing': 'border-box',
			},
			position,
			padding,
			gaps,
			height,
			contentMaxWidth
		),
	})

	const containerPinnedStyles = setForContainerPinned({
		'': contentMaxWidth['max-width']
			? assign(contentMaxWidth as CssObject, {
					height: '100%',
					width: '100%',
					position: 'absolute',
					display: 'grid',
					'pointer-events': 'none',
			  })
			: {},
	})

	const specificStyles = specificItemLayoutConverter(containerLayout, layoutProperties)

	const oneCellStyles = getOneCellWrapperStyle(
		shouldOmitWrapperLayers,
		isOneCellGridDisplayBlock,
		isOneCellGridDisplayFlex
	)

	const overflowStyles = hasOverflow
		? getOverflowWrapperStyle(
				containerLayout,
				renderScrollSnap,
				isOneCellGridDisplayBlock,
				isOneCellGridDisplayFlex
		  )
		: []

	return mergeStyles(containerStyles, ...oneCellStyles, specificStyles, ...overflowStyles, containerPinnedStyles)
}

const isVariableRef = <T>(val: Refable<T>): val is VariableReference => {
	return isObject(val) && val.type === 'VariableReference'
}

const getGridAlignment = (alignment: RefableAlignment) => {
	if (isVariableRef(alignment)) {
		return `var(${variableNameGetters.alignment.getForGrid(getVariableKey(alignment))})`
	} else {
		return gridAlignmentToString(alignment)
	}
}

const getFlexAlignment = (alignment: RefableAlignment) => {
	if (isVariableRef(alignment)) {
		return `var(${variableNameGetters.alignment.getForFlex(getVariableKey(alignment))})`
	} else {
		return flexAlignmentToString(alignment)
	}
}

const getFlexJustifyContent = (justifyContent: RefableJustifyContent) => {
	if (isVariableRef(justifyContent)) {
		return `var(${variableNameGetters.justifyContent.get(getVariableKey(justifyContent))})`
	} else {
		return flexJustifyContentToString(justifyContent)
	}
}

const parseBaseGridItem = <T extends GridItemLayouts>(specificItemLayoutConverter: (layout: T) => TargetedCss) => (
	itemLayout: T,
	additionalLayoutProperties: AdditionalLayoutProperties,
	experiments?: Experiments
) => {
	const baseStyles = createItemLayoutConverter(specificItemLayoutConverter)(
		itemLayout,
		additionalLayoutProperties,
		experiments
	)
	if (!baseStyles) {
		return
	}

	const additionalStyles: CssObject = {}

	if (itemLayout.alignSelf) {
		additionalStyles['align-self'] = getGridAlignment(itemLayout.alignSelf)
	}

	if (itemLayout.justifySelf) {
		additionalStyles['justify-self'] = getGridAlignment(itemLayout.justifySelf)
	}
	if (itemLayout.pinnedToContainer) {
		additionalStyles['pointer-events'] = 'auto'
	}
	return mergeStyles(setForItem({ '': additionalStyles }), baseStyles)
}

const parseFixedItem = parseBaseGridItem(() =>
	setForItem({
		'': {
			'grid-area': '1/1/2/2',
			'pointer-events': 'auto',
		},
	})
)

const parseFixedPositionItemLayout = (itemLayout: FixedPositionItemLayout) => {
	const emptySize = sizeToString(null)

	return setForItem({
		'': omitBy(
			{
				position: 'fixed',
				top: sizeToString(itemLayout.top),
				bottom: sizeToString(itemLayout.bottom),
				left: sizeToString(itemLayout.left),
				right: sizeToString(itemLayout.right),
				...marginsToCss(itemLayout.margins),
			},
			(value) => value === emptySize
		),
	})
}

const meshItemLayoutConverter = (itemLayout: MeshItemLayout) => {
	const emptySize = sizeToString(null)

	return setForItem({
		'': omitBy(
			{
				...(itemLayout.justifySelf && {
					'justify-self': meshAlignmentToString(itemLayout.justifySelf),
				}),
				...marginsToCss(itemLayout.margins),
			},
			(value) => value === emptySize
		),
	})
}

const getGridArea = (number: RefableNumber) => {
	if (isVariableRef(number)) {
		return `var(${variableNameGetters.number.get(getVariableKey(number))})`
	} else {
		return numberToString(number)
	}
}

/**
 * when parsing grid item we have a conflict in each axis between the size property and the position property
 * for example, width and justify - if justify is set to stretch, and we have a width, we don't know what to do
 * what will happen is we will render all properties and CSS will do its magic, in this case, the width property
 * is stronger than the justify property.
 */
const parseGridItem = parseBaseGridItem((gridItemLayout: GridItemLayout) => {
	const rootCss: CssObject = {}

	const gridArea = gridItemLayout.gridArea
	if (gridArea) {
		rootCss['grid-area'] = `${getGridArea(gridArea.rowStart)}/${getGridArea(gridArea.columnStart)}/${getGridArea(
			gridArea.rowEnd
		)}/${getGridArea(gridArea.columnEnd)}`
	}

	return setForItem({ '': rootCss })
})

const parseGridLayout = createContainerLayoutConverter((gridContainerLayout: GridContainerLayout, layoutProperties) => {
	const { spx } = layoutProperties

	const rootCss: CssObject = {
		display: 'grid',
	}

	rootCss['grid-template-rows'] = gridContainerLayout.rows.map((value) => sizeToString(value, spx)).join(' ')
	rootCss['grid-template-columns'] = gridContainerLayout.columns.map((value) => sizeToString(value, spx)).join(' ')

	if (gridContainerLayout.autoFlow) {
		rootCss['grid-auto-flow'] = gridContainerLayout.autoFlow
	}

	if (gridContainerLayout.autoRows) {
		rootCss['grid-auto-rows'] = gridContainerLayout.autoRows.map((value) => sizeToString(value, spx)).join(' ')
	}

	if (gridContainerLayout.autoColumns) {
		rootCss['grid-auto-columns'] = gridContainerLayout.autoColumns
			.map((value) => sizeToString(value, spx))
			.join(' ')
	}

	rootCss['--container-layout-type'] = 'grid-container-layout'

	return setForContainer({ '': rootCss })
})

const parseFlexContainerLayout = createContainerLayoutConverter((flexContainerLayout: FlexContainerLayouts) =>
	mergeStyles(
		setForContainer({
			'': pickBy(
				{
					display: 'flex',
					'flex-direction': kebabCase(flexContainerLayout.direction),
					'justify-content': getFlexJustifyContent(flexContainerLayout.justifyContent!),
					'align-items': getFlexAlignment(flexContainerLayout.alignItems!),
					'flex-wrap': flexContainerLayout.wrap!,
					'--container-layout-type': 'flex-container-layout',
				},
				(value) => !!value
			),
		})
	)
)

const parseFlexItemLayout = createItemLayoutConverter(<T extends FlexItemLayouts>(flexItemLayout: T) => {
	const rootCss: CssObject = {}

	if (flexItemLayout.alignSelf) {
		rootCss['align-self'] = getFlexAlignment(flexItemLayout.alignSelf)
	}

	if (isNumber(flexItemLayout.order)) {
		rootCss.order = String(flexItemLayout.order)
	}

	if (flexItemLayout.basis) {
		rootCss['flex-basis'] = sizeToString(flexItemLayout.basis)
	}

	if (isNumber(flexItemLayout.grow)) {
		rootCss['flex-grow'] = flexItemLayout.grow.toString()
	}

	if (isNumber(flexItemLayout.shrink)) {
		rootCss['flex-shrink'] = flexItemLayout.shrink.toString()
	}

	return setForItem({ '': rootCss })
})

const getWidthCss = (width: ComponentLayout['width'], { spx }: AdditionalLayoutProperties) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			width: sizeToString(width, spx),
		},
	})

const getCompHeightCss = (height: ComponentLayout['height'], spx?: Spx): SelectorToCssMap => {
	if (!height) {
		return {}
	}

	return isAspectRatio(height)
		? { '': { height: 'auto', '--aspect-ratio': height.value } }
		: { '': { height: sizeToString(height as Size, spx) } }
}

const getHeightCss = (
	height: ComponentLayout['height'],
	{ hasOverflow, spx, isOneCellGridDisplayBlock }: AdditionalLayoutProperties
) => (): SelectorToCssMap => {
	const compStyles = getCompHeightCss(height, spx)

	const isOutsideIn = !!height && (isAspectRatio(height) || !isAutoSize(height))
	// when merging isOneCellGridDisplayBlock remove this overflowContainerWrapperStyles entirely
	const overflowContainerWrapperStyles: SelectorToCssMap =
		isOutsideIn && !isOneCellGridDisplayBlock
			? {
					'': {
						position: 'absolute',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
					},
			  }
			: {
					'': {
						position: 'relative',
					},
			  }

	return mergeStyles(
		setForComponent(compStyles),
		hasOverflow ? setForOverflowWrapper(overflowContainerWrapperStyles) : ({} as TargetedCss)
	)
}

const getMinWidthCss = (
	minWidth: ComponentLayout['minWidth'],
	{ spx }: AdditionalLayoutProperties
) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			'min-width': sizeToString(minWidth, spx),
		},
	})

const getMinHeightCss = (
	minHeight: ComponentLayout['minHeight'],
	{
		spx,
		isOneCellGridDisplayFlex,
		isOneCellGridDisplayBlock,
		shouldOmitWrapperLayers,
		hasOverflow,
	}: AdditionalLayoutProperties,
	{ height }: ComponentLayout
) => (): SelectorToCssMap => {
	const cssObj: CssObject = { 'min-height': sizeToString(minHeight, spx) }
	if (isOneCellGridDisplayFlex && !shouldOmitWrapperLayers) {
		const compDisplay = minHeight && isUnitSize(minHeight) && minHeight.value === 0 ? 'flex' : 'grid'
		cssObj['--comp-display'] = compDisplay
		if (compDisplay === 'grid') {
			cssObj['grid-template-rows'] = '1fr'
			cssObj['grid-template-columns'] = 'minmax(0, 1fr)'
		}
	}

	let forContainer = {} as TargetedCss
	if (isOneCellGridDisplayBlock) {
		if (!shouldOmitWrapperLayers) {
			const hasMinValue = !!minHeight && isUnitSize(minHeight) && minHeight.value
			const isHeightAuto = !height || isAutoSize(height) || isAspectRatio(height)
			// if root height is declared (not auto), overflowed content should be at least as root
			forContainer = hasOverflow
				? setForContainer({ '': isHeightAuto && hasMinValue ? cssObj : { 'min-height': '100%' } })
				: setForContainer({ '': cssObj })
		}
	}
	const forOverflowWrapper =
		isOneCellGridDisplayBlock && hasOverflow ? setForOverflowWrapper({ '': cssObj }) : ({} as TargetedCss)

	return mergeStyles(setForComponent({ '': cssObj }), forContainer, forOverflowWrapper)
}

const getMaxWidthCss = (
	maxWidth: ComponentLayout['maxWidth'],
	{ spx }: AdditionalLayoutProperties
) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			'max-width': sizeToString(maxWidth, spx),
		},
	})

const getMaxHeightCss = (
	maxHeight: ComponentLayout['maxHeight'],
	{ spx, isOneCellGridDisplayBlock, shouldOmitWrapperLayers, hasOverflow }: AdditionalLayoutProperties
) => (): SelectorToCssMap => {
	const maxHeightCss = {
		'': {
			'max-height': sizeToString(maxHeight, spx),
		},
	}
	const forComponent = setForComponent(maxHeightCss)
	const forContainer =
		isOneCellGridDisplayBlock && !shouldOmitWrapperLayers && !hasOverflow
			? setForContainer(maxHeightCss)
			: ({} as TargetedCss)
	const forOverflowWrapper =
		isOneCellGridDisplayBlock && hasOverflow ? setForOverflowWrapper(maxHeightCss) : ({} as TargetedCss)

	return mergeStyles(forComponent, forContainer, forOverflowWrapper)
}

const getRotationCss = (rotationInDegrees: ComponentLayout['rotationInDegrees']) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			transform: `rotate(${rotationInDegrees}deg)`,
		},
	})

const getHiddenCss = (hidden: ComponentLayout['hidden']) => (): SelectorToCssMap =>
	setForComponent(
		hidden
			? {
					'': { '--l_display': 'none' },
			  }
			: { '': { '--l_display': 'unset' } }
	)

const getDirectionCss = (direction: ComponentLayout['direction']) => (): SelectorToCssMap =>
	setForComponent(
		direction
			? {
					'': {
						direction,
					},
			  }
			: {}
	)

const getContainerType = (containerType: ComponentLayout['containerType']) => (): SelectorToCssMap | null => {
	if (containerType) {
		return setForComponent({
			'': {
				'container-type': containerType,
			},
		})
	}
	return null
}

type ComponentLayoutProps = Omit<ComponentLayout, 'id' | 'type'>
const componentLayoutPropertiesConverters: {
	[P in keyof ComponentLayoutProps]: <T extends ComponentLayoutProps[P]>(
		sizeProp: T,
		additionalLayoutProperties: AdditionalLayoutProperties,
		componentLayout?: ComponentLayout
	) => () => SelectorToCssMap
} = pickBy({
	width: getWidthCss,
	height: getHeightCss,
	minWidth: getMinWidthCss,
	minHeight: getMinHeightCss,
	maxWidth: getMaxWidthCss,
	maxHeight: getMaxHeightCss,
	rotationInDegrees: getRotationCss,
	hidden: getHiddenCss,
	direction: getDirectionCss,
	containerType: getContainerType,
})

const componentLayoutDefaults = {
	height: undefined,
}

const componentLayoutConverter = (
	componentLayout: ComponentLayout | ClassicComponentLayout,
	additionalLayoutProperties: AdditionalLayoutProperties
) => {
	const componentLayoutWithDefaults = defaults(componentLayout, componentLayoutDefaults) as ComponentLayout
	const propertiesConverters = map(
		// @ts-ignore
		pickBy(componentLayoutWithDefaults, (val, key) => Boolean(componentLayoutPropertiesConverters[key] as any)),
		(val, key) =>
			// @ts-ignore
			componentLayoutPropertiesConverters[key](val, additionalLayoutProperties, componentLayoutWithDefaults)
	)

	return reduce(
		propertiesConverters,
		(selectorToCssMap, getCssFunc) => {
			const selectorToCssMapToAdd = getCssFunc()
			forEach(selectorToCssMapToAdd, (cssObj: CssObject, selector: string) => {
				// @ts-ignore
				selectorToCssMap[selector] = selectorToCssMap[selector] || {}
				// @ts-ignore
				assign(selectorToCssMap[selector], cssObj)
			})
			return selectorToCssMap as TargetedCss
		},
		{} as TargetedCss
	)
}

export const pinnedLayerDataItemToCss = (layoutDataItem: any) => {
	if (layoutDataItem.type !== 'FixedItemLayout') {
		return {}
	}

	const pinnedLayerCss = {
		position: 'fixed',
		left: 0,
		width: '100%',
		display: 'grid',
		'grid-template-columns': '1fr',
		'grid-template-rows': '1fr',
	}

	const isDockedBottom = get(layoutDataItem, 'alignSelf') === 'end'
	if (isDockedBottom) {
		assign(pinnedLayerCss, {
			bottom: 0,
			top: 'unset', // reset cascading
			height: 'auto',
		})
	} else {
		assign(pinnedLayerCss, {
			top: 0,
			bottom: 'unset', // reset cascading
			height: 'calc(100% - var(--wix-ads-height))',
			'margin-top': 'var(--wix-ads-height)',
		})
	}

	return {
		component: pinnedLayerCss,
	} as SelectorToCssMap
}

const parseMultiColumnsItemLayout = (_layout: MultiColumnsItemLayout) => {
	return setForItem({
		'': pickBy(
			{
				width: 'var(--repeater-item-width)',
			},
			(value) => !!value
		),
	})
}

const parseMultiColumnsContainerLayout = createContainerLayoutConverter((_layout: MultiColumnsContainerLayout) => {
	return mergeStyles(
		setForContainer({
			'': pickBy(
				{
					display: 'flex',
					'flex-direction': 'column',
					'flex-wrap': 'wrap',
					'--flex-column-count': _layout.columnCount,
					height: 'var(--flex-columns-height, auto)',
					'align-content': getFlexAlignment(_layout.alignContent),
					'--row-gap': sizeToString(_layout.rowGap) || 0,
					'--col-gap': sizeToString(_layout.columnGap) || 0,
					'--repeater-item-width':
						'calc((100% - var(--col-gap, 0px) * (var(--flex-column-count) - 1)) / var(--flex-column-count))',
					'--container-layout-type': 'multi-column-layout',
				},
				(value) => !!value
			),
		})
	)
})

type SimpleLayoutDataItems = Exclude<LayoutDataItems, SingleLayoutData>

type Converters = {
	readonly [P in SimpleLayoutDataItems['type']]: (
		item: TypeMapping[P],
		additionalLayoutProperties: AdditionalLayoutProperties,
		experiments?: Experiments
	) => TargetedCss | undefined
}

const noopConverter = (_: any, __: any, ___: any) => {
	return {} as TargetedCss
}
const converters: Converters = {
	ComponentLayout: componentLayoutConverter,
	FixedItemLayout: parseFixedItem,
	GridItemLayout: parseGridItem,
	GridContainerLayout: parseGridLayout,
	FlexContainerLayout: parseFlexContainerLayout,
	FlexItemLayout: parseFlexItemLayout,
	MultiColumnsItemLayout: parseMultiColumnsItemLayout,
	MultiColumnsContainerLayout: parseMultiColumnsContainerLayout,
	OrganizerContainerLayout: parseFlexContainerLayout,
	OrganizerItemLayout: parseFlexItemLayout,
	StackContainerLayout: parseFlexContainerLayout,
	StackItemLayout: parseFlexItemLayout,
	// @ts-ignore
	ClassicComponentLayout: componentLayoutConverter,
	MeshContainerLayout: noopConverter,
	MeshItemLayout: meshItemLayoutConverter,
	FixedPositionItemLayout: parseFixedPositionItemLayout,
	MasterPageItemLayout: noopConverter,
}

export const layoutDataItemToCss = (
	layoutDataItem: any,
	additionalLayoutProperties: AdditionalLayoutProperties,
	experiments?: Experiments
) => {
	const converter = converters[(layoutDataItem as SimpleLayoutDataItems).type]
	if (!converter) {
		throw new Error(`invalid layout type: ${layoutDataItem.type} for layout id ${layoutDataItem.id}`)
	}
	return converter(layoutDataItem as any, additionalLayoutProperties, experiments) as SelectorToCssMap
}
const getAlignment = (align: string, maxWidthVar: string) => {
	switch (align) {
		case 'left':
			return '0'
		case 'right':
			return `clamp(0px, (100% - ${maxWidthVar}), 100 * var(--one-unit))`
		default:
			return `clamp(0px, (100% - ${maxWidthVar}) / 2, 100 * var(--one-unit))`
	}
}
