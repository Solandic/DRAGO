import { defineCustomElement } from '../commons'
import { multiColumnLayouterWrapper } from './multiColumnLayouter'

export const multiColumnLayouterElementName = 'multi-column-layouter'

export const initMultiColumnLayouter = (contextWindow = globalThis.window) => {
	if (!contextWindow) {
		return
	}
	if (contextWindow.customElements.get(multiColumnLayouterElementName) === undefined) {
		const MultiColRepeater = multiColumnLayouterWrapper()
		defineCustomElement(contextWindow, multiColumnLayouterElementName, MultiColRepeater)
	}
}
