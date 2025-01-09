import fastdom from 'fastdom'
import { CyclicTabbing, CyclicTabbingConfig, ElementsIds, EnabledCyclicTabbingComponents } from './types'

const tabbableTags = ['iframe', 'input', 'select', 'textarea', 'button']
const candidateSelectors = [...tabbableTags, 'a[href]', '[tabindex]:not([tabindex="-1"])'].join(',')
const RESTORE_TAB_INDEX_DATA_ATTR = 'data-restore-tabindex'

export const createCyclicTabbing = ({ browserWindow, screenReaderFocus }: CyclicTabbingConfig): CyclicTabbing => {
	let enabledCyclicTabbingComponents: EnabledCyclicTabbingComponents = []

	const convertIdsToSelectors = (elementsIds: ElementsIds) => {
		const elementsIdsArr: Array<string> = Array.isArray(elementsIds) ? elementsIds : [elementsIds]
		return elementsIdsArr.map((id) => `#${id}`).join(',')
	}

	const enableCyclicTabbing: CyclicTabbing['enableCyclicTabbing'] = (
		cyclicTabbingParentCompIds: ElementsIds = []
	) => {
		if (!browserWindow) {
			return
		}
		if (enabledCyclicTabbingComponents.length > 0) {
			restoreTabIndexes()
		}
		enabledCyclicTabbingComponents.push({
			cyclicTabbingParentCompIds,
		})
		preventElementsTabbing(cyclicTabbingParentCompIds)
	}

	const disableCyclicTabbing: CyclicTabbing['disableCyclicTabbing'] = (cyclicTabbingParentCompIds: Array<string>) => {
		if (!browserWindow) {
			return
		}
		restoreTabIndexes()
		restorePreviousCyclicTabbing(cyclicTabbingParentCompIds)
	}

	const preventElementTabbing = (focusableElement: Element) => {
		const candidateTabIndex =
			focusableElement.getAttribute(RESTORE_TAB_INDEX_DATA_ATTR) || focusableElement.getAttribute('tabindex')

		fastdom.mutate(() => {
			focusableElement.setAttribute('tabindex', '-1')
			focusableElement.setAttribute(RESTORE_TAB_INDEX_DATA_ATTR, `${candidateTabIndex}`)
			if (screenReaderFocus) {
				focusableElement.setAttribute('aria-hidden', 'true')
			}
		})
	}

	function preventElementsTabbing(cyclicTabbingParentCompIds: ElementsIds) {
		function preventElementsTabbingInner() {
			const focusableElements = browserWindow!.document.querySelectorAll(candidateSelectors)
			const excludedParentElements = cyclicTabbingParentCompIds
				? Array.from(
						browserWindow!.document.querySelectorAll(convertIdsToSelectors(cyclicTabbingParentCompIds))
				  )
				: []
			focusableElements.forEach((focusableElement) => {
				if (!excludedParentElements.some((parent) => parent.contains(focusableElement))) {
					preventElementTabbing(focusableElement)
				}
			})
		}

		fastdom.measure(() => {
			preventElementsTabbingInner()
		})
	}

	const restoreTabIndexes = () => {
		fastdom.measure(() => {
			const focusableElements = browserWindow!.document.querySelectorAll(`[${RESTORE_TAB_INDEX_DATA_ATTR}]`)
			focusableElements.forEach((focusableElement) => {
				const restoredTabIndex = focusableElement.getAttribute(RESTORE_TAB_INDEX_DATA_ATTR)

				fastdom.mutate(() => {
					if (restoredTabIndex === 'null') {
						focusableElement.removeAttribute('tabindex')
					} else if (restoredTabIndex) {
						focusableElement.setAttribute('tabindex', restoredTabIndex)
					}
					focusableElement.removeAttribute(RESTORE_TAB_INDEX_DATA_ATTR)
					if (screenReaderFocus) {
						focusableElement.removeAttribute('aria-hidden')
					}
				})
			})
		})
	}

	const restorePreviousCyclicTabbing = (cyclicTabbingParentCompIds: Array<string>) => {
		const parentSelectors = convertIdsToSelectors(cyclicTabbingParentCompIds)
		enabledCyclicTabbingComponents = enabledCyclicTabbingComponents.filter(
			(component) => convertIdsToSelectors(component.cyclicTabbingParentCompIds) !== parentSelectors
		)
		const lastModuleInFocus = enabledCyclicTabbingComponents.pop()
		if (lastModuleInFocus) {
			enableCyclicTabbing(lastModuleInFocus.cyclicTabbingParentCompIds)
		}
	}

	return {
		enableCyclicTabbing,
		disableCyclicTabbing,
	}
}
