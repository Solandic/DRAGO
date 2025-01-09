import type {
	ItemsAlignmentValue,
	JustifyContentValue,
	UnitSizeValue,
	VariablesValues,
	NumberValue,
	KeywordLengthValue,
	PositionTypeValue,
	LayoutSizeValue,
} from '@wix/thunderbolt-becky-types'
import {
	unitSizeToString,
	gridAlignmentToString,
	flexAlignmentToString,
	flexJustifyContentToString,
	numberToString,
	templateLengthToString,
	positionToCss,
} from './layoutValuesToCss'
import { resolveSpxAttribute } from '../css'

export const isUnitSizeValue = (value: VariablesValues): value is UnitSizeValue => value.type === 'UnitSizeValue'
export const isItemsAlignmentValue = (value: VariablesValues): value is ItemsAlignmentValue =>
	value.type === 'ItemsAlignmentValue'
export const isJustifyContentValue = (value: VariablesValues): value is JustifyContentValue =>
	value.type === 'JustifyContentValue'
export const isNumberValue = (value: VariablesValues): value is NumberValue => value.type === 'NumberValue'

export const isKeywordLengthValue = (value: VariablesValues): value is KeywordLengthValue =>
	value.type === 'KeywordLengthValue'
export const isPositionTypeValue = (value: VariablesValues): value is PositionTypeValue =>
	value.type === 'PositionTypeValue'

export const isLayoutSizeValue = (value: VariablesValues): value is LayoutSizeValue => value.type === 'LayoutSizeValue'

const getBaseVarName = (varId: string) => `--${varId}`

const getVarNameWithSuffix = (varId: string, suffix: string) => `${getBaseVarName(varId)}-${suffix}`

export const variableNameGetters = {
	unitSize: {
		get: (varId: string) => getBaseVarName(varId),
	},
	alignment: {
		getForGrid: (varId: string) => getVarNameWithSuffix(varId, 'grid'),
		getForFlex: (varId: string) => getVarNameWithSuffix(varId, 'flex'),
	},
	justifyContent: {
		get: (varId: string) => getBaseVarName(varId),
	},
	number: {
		get: (varId: string) => getBaseVarName(varId),
	},
	repeatLength: { get: (varId: string) => getBaseVarName(varId) },
	position: {
		get: (varId: string) => getBaseVarName(varId),
		getForceAuto: (varId: string) => getVarNameWithSuffix(varId, 'force-auto'),
		getHeaderOffset: (varId: string) => getVarNameWithSuffix(varId, 'header-offset'),
		getStickyOffset: (varId: string) => getVarNameWithSuffix(varId, 'sticky-offset'),
	},
	layoutSize: {
		get: (varId: string) => getBaseVarName(varId),
	},
}

export const getVariableCss = (
	varValue: VariablesValues,
	variableKey: string,
	environmentRefs: { renderSticky: boolean }
): Record<string, string> => {
	if (isUnitSizeValue(varValue)) {
		return { [variableNameGetters.unitSize.get(variableKey)]: unitSizeToString(varValue.value) }
	}

	if (isItemsAlignmentValue(varValue)) {
		return {
			[variableNameGetters.alignment.getForGrid(variableKey)]: gridAlignmentToString(varValue.value),
			[variableNameGetters.alignment.getForFlex(variableKey)]: flexAlignmentToString(varValue.value),
		}
	}

	if (isJustifyContentValue(varValue)) {
		return {
			[variableNameGetters.justifyContent.get(variableKey)]: flexJustifyContentToString(varValue.value),
		}
	}

	if (isNumberValue(varValue)) {
		return { [variableNameGetters.number.get(variableKey)]: numberToString(varValue.value) }
	}

	if (isKeywordLengthValue(varValue)) {
		return { [variableNameGetters.repeatLength.get(variableKey)]: templateLengthToString(varValue.value) }
	}
	if (isPositionTypeValue(varValue)) {
		const { position, stickyOffset, headerOffset, forceAuto } = positionToCss(varValue.value, environmentRefs)
		return {
			[variableNameGetters.position.get(variableKey)]: position,
			[variableNameGetters.position.getForceAuto(variableKey)]: forceAuto,
			...(stickyOffset ? { [variableNameGetters.position.getStickyOffset(variableKey)]: stickyOffset } : {}),
			...(headerOffset ? { [variableNameGetters.position.getHeaderOffset(variableKey)]: headerOffset } : {}),
		}
	}

	if (isLayoutSizeValue(varValue)) {
		if (varValue.value.type === 'Calc') {
			return {
				[variableNameGetters.layoutSize.get(variableKey)]: `calc(${resolveSpxAttribute(
					varValue.value.value,
					undefined,
					true
				)})`,
			}
		}
	}

	return {}
}
