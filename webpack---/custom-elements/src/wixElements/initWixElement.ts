// @ts-nocheck

import { initResizeService } from '../utils/initResizeService'
import { wixElementWrapper } from './wixElement'

const initWixElement = (contextWindow) => {
	if (!contextWindow.customElementNamespace) {
		contextWindow.customElementNamespace = {}
	}
	if (contextWindow.customElementNamespace.WixElement === undefined) {
		const resizeService = initResizeService()
		const WixElement = wixElementWrapper({ resizeService }, contextWindow)
		contextWindow.customElementNamespace.WixElement = WixElement
		return WixElement
	}
	return contextWindow.customElementNamespace.WixElement
}

export { initWixElement }
