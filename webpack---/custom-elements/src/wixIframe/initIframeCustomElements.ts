import { wixIframeWrapper } from './wixIframe'
import { defineCustomElement } from '../commons'
import { initWixElement } from '../wixElements'

export const wixIframeElementName = 'wix-iframe'

export const initWixIframe = (contextWindow = globalThis.window) => {
	if (!contextWindow) {
		return
	}
	if (contextWindow.customElements.get(wixIframeElementName) === undefined) {
		const WixElement = initWixElement(contextWindow)
		const WixIframe = wixIframeWrapper(WixElement)
		defineCustomElement(contextWindow, wixIframeElementName, WixIframe)
	}
}
