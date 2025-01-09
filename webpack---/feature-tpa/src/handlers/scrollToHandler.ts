import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindowSymbol,
	BrowserWindow,
	TpaHandlerProvider,
	ExperimentsSymbol,
	ReducedMotionSymbol,
	Experiments,
} from '@wix/thunderbolt-symbols'

export type MessageData = {
	x: number
	y: number
	scrollAnimation?: boolean
}

export const ScrollToHandler = withDependencies(
	[BrowserWindowSymbol, ExperimentsSymbol, ReducedMotionSymbol],
	(window: BrowserWindow, experiments: Experiments, reducedMotion): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				async scrollTo(compId, { x, y, scrollAnimation }: MessageData) {
					const useAnimation = scrollAnimation && !reducedMotion

					if (useAnimation) {
						window!.scrollTo({ left: x, top: y, behavior: 'smooth' })
					} else {
						window!.scrollTo(x, y)
					}
				},
			}
		},
	})
)
