import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	FeatureStateSymbol,
	IPropsStore,
	Props,
	contextIdSymbol,
	pageIdSym,
	PageFeatureConfigSymbol,
	Experiments,
	ExperimentsSymbol,
} from '@wix/thunderbolt-symbols'
import type {
	PageTransitionsPageConfig,
	PageTransitionsPageState,
	CompareDataDeep,
	HaveEqualBackgrounds,
} from './types'
import { name } from './symbols'
import { ComponentWillMount, ViewerComponent } from 'feature-components'
import type { IFeatureState } from 'thunderbolt-feature-state'
import type { FillLayersProps } from '@wix/thunderbolt-becky-types'
import _ from 'lodash'

const FILL_LAYERS_PROP_FIELDS_TO_COMPARE = [
	'video.videoInfo.videoId',
	'image.uri',
	'image.link.href',
	'image.displayMode',
	'backgroundImage.uri',
	'backgroundImage.link.href',
	'backgroundImage.displayMode',
]

const PROPS_TO_COMPARE = [
	'type',
	'alignType',
	'fittingType',
	'scrollType',
	'colorOverlay',
	'colorOverlayOpacity',
	'color',
	'opacity',
]

const compareDataDeep: CompareDataDeep = (prevData, currentData, refKeys, propsToCheck) => {
	// @ts-ignore
	const equal = propsToCheck.every((key: string) => (prevData && prevData[key]) === (currentData && currentData[key]))
	return (
		equal &&
		refKeys.every((ref: string) =>
			prevData || currentData
				? // @ts-ignore
				  compareDataDeep(prevData && prevData[ref], currentData && currentData[ref], refKeys, propsToCheck)
				: true
		)
	)
}

const haveEqualBackgroundsData: HaveEqualBackgrounds = (currentPageBackground, prevPageBackground) => {
	if (!prevPageBackground || !currentPageBackground) {
		return false
	}

	// prev page background media data
	const prevMediaData = prevPageBackground.mediaRef
	const prevMediaDataType = prevMediaData && prevMediaData.type
	// current page background media data
	const currentMediaData = currentPageBackground.mediaRef
	const currentMediaDataType = currentMediaData && currentMediaData.type

	const isOnlyColor = !prevMediaData && !currentMediaData
	const isMediaTypeEqual = isOnlyColor || prevMediaDataType === currentMediaDataType
	const shouldIgnoreColor = prevMediaDataType === 'WixVideo' && isMediaTypeEqual

	const refKeys = ['mediaRef', 'imageOverlay']
	let propsToCheck = [...PROPS_TO_COMPARE]
	if (shouldIgnoreColor) {
		const colorIndex = propsToCheck.indexOf('color')
		propsToCheck.splice(colorIndex, 1)
	} else if (isOnlyColor) {
		propsToCheck = ['color']
	}

	return isMediaTypeEqual && compareDataDeep(prevPageBackground, currentPageBackground, refKeys, propsToCheck)
}

const haveEqualBackgrounds = (currentPageBackground: FillLayersProps, prevPageBackground: FillLayersProps): boolean => {
	if (!prevPageBackground || !currentPageBackground) {
		return false
	}
	return FILL_LAYERS_PROP_FIELDS_TO_COMPARE.every(
		(path) => _.get(prevPageBackground, path) === _.get(currentPageBackground, path)
	)
}

export const PageBackgroundComponentTransitionsWillMount = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		Props,
		named(FeatureStateSymbol, name),
		pageIdSym,
		contextIdSymbol,
		ExperimentsSymbol,
	],
	(
		pageConfig: PageTransitionsPageConfig,
		propsStore: IPropsStore,
		featureState: IFeatureState<PageTransitionsPageState>,
		pageId: string,
		contextId: string,
		experiments: Experiments
	): ComponentWillMount<ViewerComponent> => {
		const pageBackgroundCompId = `pageBackground_${pageId}`
		const isNewLogicEnabled = experiments['specs.thunderbolt.bg_transitions_new_logic']

		const updatePageBackground = (nextBg: FillLayersProps, hasBackgroundChanged: boolean) => {
			featureState.update((currentState) => ({
				...currentState,
				pageBackgroundProp: nextBg,
				pageBackground: pageConfig.pageBackground,
			}))

			const _transitionEnabled = featureState.get()?.nextTransitionEnabled ?? true
			const transitionEnabled = _transitionEnabled && hasBackgroundChanged

			propsStore.update({
				BACKGROUND_GROUP: {
					key: `BACKGROUND_GROUP_${pageConfig.viewMode}`,
					transitionEnabled,
					className: `backgroundGroup_${pageId}`,
				},
			})
		}

		const hasBackgroundChanged = (nextBg: FillLayersProps) => {
			const state = featureState.get()
			const prevBg = state?.pageBackgroundProp

			const pageBackgroundData = pageConfig.pageBackground
			const prevBackgroundData = state?.pageBackground

			const pageUnderlayColorChanged = !haveEqualBackgroundsData(pageBackgroundData, prevBackgroundData)
			return !haveEqualBackgrounds(nextBg, prevBg) || pageUnderlayColorChanged
		}

		if (isNewLogicEnabled && propsStore.get(pageBackgroundCompId)) {
			const nextBg = propsStore.get(pageBackgroundCompId).fillLayers
			const hasBgChanged = hasBackgroundChanged(nextBg)
			updatePageBackground(nextBg, hasBgChanged)
		}

		const unsubscribeFromPropChanges = propsStore.subscribeToChanges((changes) => {
			if (pageBackgroundCompId in changes) {
				const nextBg: FillLayersProps = changes[pageBackgroundCompId]?.fillLayers
				const backgroundChanged = hasBackgroundChanged(nextBg)

				if (isNewLogicEnabled && backgroundChanged) {
					updatePageBackground(nextBg, true)
				} else if (!isNewLogicEnabled) {
					updatePageBackground(nextBg, backgroundChanged)
				}
			}
		})

		featureState.update((currentState) => {
			const propsUpdateListenersUnsubscribers = currentState?.propsUpdateListenersUnsubscribers ?? {}
			propsUpdateListenersUnsubscribers[contextId] = unsubscribeFromPropChanges
			return {
				...(currentState || {}),
				propsUpdateListenersUnsubscribers,
			}
		})

		return {
			componentTypes: ['PageBackground'],
			componentWillMount() {
				const state = featureState.get()
				const isFirstMount = state?.isFirstMount ?? true

				featureState.update(() => ({
					...state,
					isFirstMount,
				}))
			},
		}
	}
)
