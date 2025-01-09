import { wixVideoWrapper } from './wixVideo'
import { defineCustomElement } from '../commons'
import { initWixElement } from '../wixElements'

export const wixVideoElementName = 'wix-video'

export const initWixVideo = (
	contextWindow = globalThis.window,
	externalServices = {},
	environmentConsts = {
		experiments: {},
	}
) => {
	if (!contextWindow) {
		return
	}
	if (contextWindow.customElements.get(wixVideoElementName) === undefined) {
		const WixElement = initWixElement(contextWindow)
		const WixVideo = wixVideoWrapper(WixElement, externalServices, environmentConsts)
		defineCustomElement(contextWindow, wixVideoElementName, WixVideo)
	}
}
