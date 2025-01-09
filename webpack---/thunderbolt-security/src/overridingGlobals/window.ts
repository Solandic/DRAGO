import { isInCurrentDomain } from '../helpers'
import { WindowFeatures } from '../types'

// Overriding window open and document open in order to no get the child window context
export const overrideWindowOpen = () => {
	const originalOpen = globalThis.open
	const originalDocumentOpen = document.open

	const windowOpen = (url: string, target: string, windowFeatures: WindowFeatures) => {
		const isEmptyWindow = typeof url !== 'string'
		const child = originalOpen.call(window, url, target, windowFeatures)
		return isEmptyWindow || isInCurrentDomain(url) ? {} : child
	}

	const documentOpen = (url: string, target: string, windowFeatures: WindowFeatures) => {
		if (url) {
			return windowOpen(url, target, windowFeatures)
		} else {
			return originalDocumentOpen.call(document, url, target, windowFeatures)
		}
	}

	// @ts-expect-error
	defineStrictProperty('open', windowOpen, globalThis, true)

	// @ts-expect-error
	defineStrictProperty('open', documentOpen, document, true)
}
