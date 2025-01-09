import { multi, withDependencies } from '@wix/thunderbolt-ioc'
import { IOnLinkClickHandler } from './types'
import {
	BrowserWindowSymbol,
	BrowserWindow,
	Experiments,
	ExperimentsSymbol,
	ILinkClickHandler,
	NavigationClickHandlerSymbol,
	SiteLinkClickHandlerSymbol,
} from '@wix/thunderbolt-symbols'
import { yieldToMain, queryParamsWhitelist } from '@wix/thunderbolt-commons'

type HTMLElementTarget = HTMLElement | null

const shouldAllowButtonTagTarget = (eTarget: HTMLElementTarget, experiments: Experiments) =>
	!experiments['specs.thunderbolt.lightboxFromButton'] || (eTarget && eTarget.tagName.toLowerCase() !== 'button')

const getButtonOrAnchorTarget = (event: MouseEvent, experiments: Experiments) => {
	let eTarget = event.target as HTMLElementTarget

	while (
		eTarget &&
		(!eTarget.tagName ||
			(eTarget.tagName.toLowerCase() !== 'a' && shouldAllowButtonTagTarget(eTarget, experiments)))
	) {
		eTarget = eTarget.parentNode as HTMLElementTarget
	}

	return eTarget
}

const shouldNotHandleLink = (anchorTarget: HTMLElementTarget) => {
	if (!anchorTarget) {
		return false
	}
	const href = anchorTarget.getAttribute('href') || ''
	return anchorTarget.getAttribute('data-cancel-link') || (href.startsWith('#') && href !== '#')
}

const applyRetainedQueryParams = (browserWindow: NonNullable<BrowserWindow>, href: string): string => {
	const siteQueryParams = new URL(browserWindow.location.href).searchParams
	const parsedUrl = new URL(href)
	siteQueryParams.forEach((value, key) => {
		if (queryParamsWhitelist.has(key)) {
			parsedUrl.searchParams.set(key, value)
		}
	})

	return parsedUrl.href
}

export const onLinkClickHandler = (
	experiments: Experiments,
	navigationHandler: ILinkClickHandler,
	siteLinkClickHandlers: Array<ILinkClickHandler>,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	browserWindow: BrowserWindow
): IOnLinkClickHandler => {
	const masterPageClickHandlers: Array<ILinkClickHandler> = []
	const pageClickHandlers: Array<ILinkClickHandler> = []
	return {
		onLinkClick: async (e: MouseEvent) => {
			let shouldResumeDefault = true
			if (e.metaKey || e.ctrlKey) {
				return
			}
			const anchorTarget = getButtonOrAnchorTarget(e, experiments)

			if (!anchorTarget) {
				return
			}

			let href = anchorTarget.getAttribute('href') || ''
			if (shouldNotHandleLink(anchorTarget)) {
				return
			}

			if (window && href) {
				href = applyRetainedQueryParams(window, href)
			}

			const isFullPageLoad = experiments['specs.thunderbolt.fullPageNavigationSpecificSites']
			const isEditable = !!anchorTarget.closest('[contenteditable="true"]')
			const shouldRunSynchronously =
				process.env.PACKAGE_NAME === 'thunderbolt-ds' ||
				href.startsWith('blob:') ||
				isFullPageLoad ||
				isEditable
			if (!shouldRunSynchronously) {
				e.preventDefault()
				await yieldToMain()
			}

			const fireHandlers = (handlers: Array<ILinkClickHandler>) => {
				for (const handler of handlers) {
					if (isFullPageLoad && handler.handlerId === 'router') {
						return
					}
					const didHandle = handler.handleClick(anchorTarget)
					if (didHandle) {
						shouldResumeDefault = false
						if (shouldRunSynchronously) {
							e.preventDefault()
						}
						e.stopPropagation()
						return
					}
				}
			}

			fireHandlers([...siteLinkClickHandlers, ...masterPageClickHandlers])
			fireHandlers([...pageClickHandlers, navigationHandler])

			if (!shouldRunSynchronously && shouldResumeDefault) {
				href && window?.open(href, anchorTarget.getAttribute('target') || '_self')
			}
		},
		registerPageClickHandler: (handler: ILinkClickHandler, pageId: string) => {
			pageId === 'masterPage' ? masterPageClickHandlers.push(handler) : pageClickHandlers.push(handler)
		},
	}
}

export const OnLinkClickHandler = withDependencies(
	[ExperimentsSymbol, NavigationClickHandlerSymbol, multi(SiteLinkClickHandlerSymbol), BrowserWindowSymbol] as const,
	onLinkClickHandler
)
