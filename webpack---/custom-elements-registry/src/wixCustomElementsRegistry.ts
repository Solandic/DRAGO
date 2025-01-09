// @ts-nocheck

import {
	throttleToAnimationFrame,
	wixBgMediaWrapper,
	wixElementWrapper,
	multiColumnLayouterWrapper,
	multiColumnLayouterElementName,
	initResizeService,
} from '@wix/custom-elements'
import nativeShim from './shims/native-shim'

function init(services, contextWindow = window) {
	nativeShim(contextWindow)

	const windowResizeService = {
		registry: new Set(),
		observe(element) {
			windowResizeService.registry.add(element)
		},
		unobserve(element) {
			windowResizeService.registry.delete(element)
		},
	}

	services.windowResizeService.init(
		throttleToAnimationFrame(() => windowResizeService.registry.forEach((element) => element.reLayout())),
		contextWindow
	)

	const resizeService = initResizeService()

	const defineCustomElement = (elementName, elementClass) => {
		if (contextWindow.customElements.get(elementName) === undefined) {
			contextWindow.customElements.define(elementName, elementClass)
		}
	}

	const WixElement = wixElementWrapper({ resizeService }, contextWindow)
	contextWindow.customElementNamespace = { WixElement }
	defineCustomElement('wix-element', WixElement)

	const defineWixBgMedia = (externalServices) => {
		const WixBgMedia = wixBgMediaWrapper(WixElement, { windowResizeService, ...externalServices }, contextWindow)
		defineCustomElement('wix-bg-media', WixBgMedia)
	}
	const defineMultiColumnRepeaterElement = () => {
		const MultiColRepeater = multiColumnLayouterWrapper()
		defineCustomElement(multiColumnLayouterElementName, MultiColRepeater)
	}

	return {
		contextWindow,
		defineWixBgMedia,
		defineMultiColumnRepeaterElement,
	}
}

export default {
	init,
}
