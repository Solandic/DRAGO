import fastdom from 'fastdom'

import { ISiteScrollBlocker, SiteScrollBlockerConfig } from './types'

export const createSiteScrollBlocker = ({
	browserWindow,
	isSSR,
	onSiteScrollBlockChanged,
	shouldBlockScrollWithoutVar,
}: SiteScrollBlockerConfig = {}): ISiteScrollBlocker => {
	const window = browserWindow ?? globalThis.window

	let lastBlockListenerId = 0
	const blockListeners = new Map<unknown, any>()

	const blockSiteScrollingClassName = shouldBlockScrollWithoutVar ? 'siteScrollingBlocked' : 'blockSiteScrolling'

	let blockers: Array<string> = []
	let _scrollCorrection = 0
	let siteContainerOriginMarginTop: string | undefined
	let wixAdsOriginMarginTop: string | undefined

	const isScrollingBlocked = () => blockers.length > 0

	const restoreScrollPosition = () => {
		window!.scrollTo(0, _scrollCorrection)
	}

	const getSiteElements = () => ({
		bodyElement: document.body as HTMLBodyElement,
		siteContainerElement: document.getElementById('SITE_CONTAINER'),
		wixAdsElement: document.getElementById('WIX_ADS'),
	})

	const setMarginTop = (element: HTMLElement, marginTop: string = '') => {
		element.style.marginTop = marginTop
	}

	const blockSiteScrolling = (blocker: string) => {
		const { bodyElement, siteContainerElement, wixAdsElement } = getSiteElements()

		fastdom.measure(() => {
			// The site should be blocked only when it's not already blocked
			if (!bodyElement.classList.contains(blockSiteScrollingClassName)) {
				_scrollCorrection = window!.scrollY
				fastdom.mutate(() => {
					if (shouldBlockScrollWithoutVar) {
						const marginTop = `calc(${Math.max(0.5, _scrollCorrection)}px)`
						siteContainerOriginMarginTop = siteContainerElement?.style.marginTop
						siteContainerElement && setMarginTop(siteContainerElement, `calc(${marginTop}*-1)`)
						wixAdsOriginMarginTop = wixAdsElement?.style.marginTop
						wixAdsElement &&
							!bodyElement.classList.contains('responsive') &&
							setMarginTop(wixAdsElement, marginTop)
					} else {
						bodyElement.style.setProperty(
							'--blocked-site-scroll-margin-top',
							`${Math.max(0.5, _scrollCorrection)}px`
						)
					}
					bodyElement.classList.add(blockSiteScrollingClassName)
				})
			}
		})

		blockListeners.forEach(({ handleBlockedBy }) => handleBlockedBy && handleBlockedBy(blocker))
	}

	const unblockSiteScrolling = (blocker: string) => {
		const { bodyElement, siteContainerElement, wixAdsElement } = getSiteElements()
		fastdom.mutate(() => {
			bodyElement.classList.remove(blockSiteScrollingClassName)
			if (shouldBlockScrollWithoutVar) {
				siteContainerElement && setMarginTop(siteContainerElement, siteContainerOriginMarginTop)
				wixAdsElement &&
					!bodyElement.classList.contains('responsive') &&
					setMarginTop(wixAdsElement, wixAdsOriginMarginTop)
			} else {
				bodyElement.style.removeProperty('--blocked-site-scroll-margin-top')
			}
			restoreScrollPosition()
		})

		blockListeners.forEach(({ handleUnblockedBy }) => handleUnblockedBy && handleUnblockedBy(blocker))
	}

	const addBlocker = (blocker: string) => {
		blockers = !blockers.includes(blocker) ? [...blockers, blocker] : blockers
		onSiteScrollBlockChanged && onSiteScrollBlockChanged(isScrollingBlocked())

		// The site should be blocked only when there's one blocker,
		// otherwise it's already blocked (more than one) or doesn't need to be blocked (zero)
		const shouldBlock = blockers.length === 1

		if (shouldBlock) {
			blockSiteScrolling(blocker)
		}
	}

	const removeBlocker = (blocker: string) => {
		const [activeBlocker] = blockers
		blockers = blockers.filter((b) => b !== blocker)
		const [newActiveBlocker] = blockers

		onSiteScrollBlockChanged && onSiteScrollBlockChanged(isScrollingBlocked())

		// The active blocker changes if we remove the blockers not from the end to start.
		// For example, removing from start to end, the active blocker should be adjusted each time (because the first blocker changes)
		const hasActiveBlockerChanged = activeBlocker !== newActiveBlocker

		if (hasActiveBlockerChanged) {
			if (newActiveBlocker) {
				blockSiteScrolling(blocker)
			} else {
				unblockSiteScrolling(blocker)
			}
		}
	}

	const setSiteScrollingBlocked = (blocked: boolean, compId: string) => {
		if (isSSR && isSSR(window)) {
			return
		}

		return blocked ? addBlocker(compId) : removeBlocker(compId)
	}

	return {
		setSiteScrollingBlocked,
		registerScrollBlockedListener(listener) {
			const listenerId = ++lastBlockListenerId
			blockListeners.set(listenerId, listener)
			return listenerId
		},
		unRegisterScrollBlockedListener(listenerId) {
			blockListeners.delete(listenerId)
		},
		isScrollingBlocked,
	}
}
