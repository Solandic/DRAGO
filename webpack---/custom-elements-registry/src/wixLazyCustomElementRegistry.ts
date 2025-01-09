// @ts-nocheck
import { initWixIframe, initWixVideo, initWixBgImage } from '@wix/custom-elements'
import { prefersReducedMotion } from '@wix/thunderbolt-environment'

export const initLazyCustomElements = (contextWindow?: any = window) => {
	const { mediaServices, environmentConsts, requestUrl, staticVideoUrl } = contextWindow.customElementNamespace

	initWixVideo(contextWindow, mediaServices, {
		...environmentConsts,
		prefersReducedMotion: prefersReducedMotion(window, requestUrl),
		staticVideoUrl,
	})

	initWixIframe(contextWindow)
	initWixBgImage(contextWindow, mediaServices, environmentConsts)
}
