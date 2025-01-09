import { wixBgImageWrapper } from './wixBgImage'
import { defineCustomElement } from '../commons'
import { initWixElement } from '../wixElements'

export const wixBgImageElementName = 'wix-bg-image'

export const initWixBgImage = (
	contextWindow = globalThis.window,
	externalServices = {},
	environmentConsts = {
		experiments: {},
	}
) => {
	if (!contextWindow) {
		return
	}
	if (contextWindow.customElements.get(wixBgImageElementName) === undefined) {
		const WixElement = initWixElement(contextWindow)
		const WixBgImage = wixBgImageWrapper(WixElement, externalServices, environmentConsts, contextWindow)
		defineCustomElement(contextWindow, wixBgImageElementName, WixBgImage)
	}
}
