import fastdom from 'fastdom'
import { wixDropdownMenuWrapper } from './wixDropdownMenu'
import { initResizeService } from '../utils/initResizeService'
import { initWixElement } from '../wixElements'

export const wixDropdownMenuElementName = 'wix-dropdown-menu'

export const initCustomElementsDropdownMenu = (contextWindow = globalThis.window) => {
	if (!contextWindow) {
		return
	}
	if (contextWindow.customElements.get(wixDropdownMenuElementName) === undefined) {
		const resizeService = initResizeService()
		const WixElement = initWixElement(contextWindow)

		const WixDropdownMenu = wixDropdownMenuWrapper(
			WixElement,
			{ resizeService, mutationService: fastdom },
			contextWindow
		)
		contextWindow.customElements.define(wixDropdownMenuElementName, WixDropdownMenu)
	}
}
