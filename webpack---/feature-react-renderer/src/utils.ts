import type { Component, NicknameToCompIdMaps, Structure } from '@wix/thunderbolt-becky-types'
import { GHOST_COMP_STRUCTURE_OVERRIDES } from './consts'
import _ from 'lodash'

const compPathToId = (nicknameToCompIdMaps: NicknameToCompIdMaps, topLevelId: string, compPath: string): string => {
	const compId = compPath.split('/').reduce((acc, part) => {
		const nicknameToCompIdMap = nicknameToCompIdMaps[acc]
		return `${acc}_r_${nicknameToCompIdMap[part]}`
	}, topLevelId)

	return compId.split('_r_').slice(1).join('_r_')
}

export const getGhostComponents = (
	nicknameToCompIdMaps: NicknameToCompIdMaps,
	innerElementsToRemove: Array<string>,
	tooLevelId: string,
	structure: Structure
): Record<string, Component> => {
	const compIdsToRemove = innerElementsToRemove.map((compPath) =>
		compPathToId(nicknameToCompIdMaps, tooLevelId, compPath)
	)
	return compIdsToRemove?.reduce((acc: Record<string, Component>, compId) => {
		acc[compId] = { ...structure[compId], ...GHOST_COMP_STRUCTURE_OVERRIDES }
		return acc
	}, {})
}

export const getOverrides = (
	nicknameToCompIdMaps: NicknameToCompIdMaps,
	innerElementsDataOverrides: Record<string, any>,
	topLevelId: string,
	compProps: Record<string, any>
): Record<string, any> => {
	return _.reduce(
		innerElementsDataOverrides,
		(acc: Record<string, any>, __, compPath: string) => {
			const override = innerElementsDataOverrides[compPath]
			const innerElementId = compPathToId(nicknameToCompIdMaps, topLevelId, compPath)
			acc[innerElementId] = { ...compProps[innerElementId], ...override }
			return acc
		},
		{}
	)
}
