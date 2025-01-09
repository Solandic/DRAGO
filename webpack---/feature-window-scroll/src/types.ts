export type ScrollToCallbacks = {
	onComplete?: () => void
}

type scrollToComponentOptions = {
	callbacks?: ScrollToCallbacks
	skipScrollAnimation?: boolean
}

export type IWindowScrollAPI = {
	animatedScrollTo: (targetY: number, callbacks?: ScrollToCallbacks) => Promise<ScrollAnimationResult>
	scrollToComponent: (targetCompId: string, options?: scrollToComponentOptions) => Promise<void>
	scrollToSelector: (selector: string, openLightboxId?: string, options?: scrollToComponentOptions) => void
}

export type IResolvableReadyForScrollPromise = {
	readyForScrollPromise: Promise<void>
	setReadyForScroll: () => void
}

export type WindowScrollPageConfig = {
	headerComponentId: string
	headerContainerComponentId: string
}

export type WindowScrollMasterPageConfig = {
	isHeaderAnimated: boolean
}

export enum ScrollAnimationResult {
	Completed,
	Aborted,
}
