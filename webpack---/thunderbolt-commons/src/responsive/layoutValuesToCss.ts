import type {
	Alignment,
	JustifyContent,
	MeshItemAlignment,
	Spx,
	UnitSize,
	KeywordLength,
	Position,
} from '@wix/thunderbolt-becky-types'
import { resolveSpxValue } from '../css'

export const unitSizeToString = (size: UnitSize, spx?: Spx): string => {
	if (size.type === 'percentage') {
		return `${size.value}%`
	}
	if (size.type === 'number') {
		return `${size.value}`
	}
	if (size.type === 'spx') {
		return resolveSpxValue(`${size.value}spx`, spx)
	}

	return `${size.value}${size.type}`
}

export const numberToString = (number: number): string => number.toString()

export const gridAlignmentToString = (alignment: Alignment): string => alignment.toLowerCase()

// consider move all code related to content area to layoutToCss
//
export const meshAlignmentToString = (alignment: MeshItemAlignment): string => {
	if (alignment === 'content') {
		return 'start'
	}

	return alignment.toLowerCase()
}

const alignmentToFlexSyntax = {
	start: 'flex-start' as 'flex-start',
	end: 'flex-end' as 'flex-end',
	center: 'center' as 'center',
	stretch: 'stretch' as 'stretch',
	auto: 'auto' as 'auto',
}

export const flexAlignmentToString = (alignment: Alignment): string => alignmentToFlexSyntax[alignment]

const justifyContentToFlexSyntax = {
	start: 'flex-start' as 'flex-start',
	end: 'flex-end' as 'flex-end',
	center: 'center' as 'center',
	spaceBetween: 'space-between' as 'space-between',
	spaceAround: 'space-around' as 'space-around',
	spaceEvenly: 'space-evenly' as 'space-evenly',
}

export const flexJustifyContentToString = (justifyContent: JustifyContent): string =>
	justifyContentToFlexSyntax[justifyContent]

export const templateLengthToString = (value: number | KeywordLength): string => {
	if (typeof value === 'number') {
		return numberToString(value)
	}
	return value.toLowerCase()
}

export const positionToCss = (
	position: Position,
	environmentRefs: { renderSticky: boolean }
): Record<string, string> => {
	const isStickyToHeader = position === 'stickyToHeader'
	const isStickyPosition = position === 'sticky' || isStickyToHeader
	const isStickyDisabled = isStickyPosition && !environmentRefs.renderSticky

	if (isStickyDisabled) {
		return {
			position: 'relative',
			forceAuto: 'auto',
		}
	}

	return {
		position: isStickyToHeader ? 'sticky' : position,
		headerOffset: isStickyToHeader ? 'var(--top-offset)' : '0px',
		stickyOffset: isStickyPosition ? 'var(--sticky-offset)' : '0px',
		forceAuto: 'initial',
	}
}
