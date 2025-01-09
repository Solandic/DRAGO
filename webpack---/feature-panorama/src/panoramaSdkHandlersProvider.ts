import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol, PanoramaSdkHandlers, SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { addRerouteDataToSentryEvent, SENTRY_IS_TPA_MARK_KEY } from '@wix/thunderbolt-commons'

export const panoramaSdkHandlersProvider = withDependencies(
	[BrowserWindowSymbol],
	(window: NonNullable<BrowserWindow>): SdkHandlersProvider<PanoramaSdkHandlers> => {
		return {
			getSdkHandlers: () => ({
				panorama: {
					onUnhandledError: (handler: (error: Error) => void) => {
						window.Sentry.onLoad(() => {
							window.Sentry.addGlobalEventProcessor((event, hint) => {
								addRerouteDataToSentryEvent(event)

								// Do nothing if the error originated from an external app
								if (event.extra?.[SENTRY_IS_TPA_MARK_KEY]) {
									return event
								}

								const exceptions = event.exception?.values ?? []

								// Do nothing if the error is handled
								if (exceptions[0]?.mechanism?.handled) {
									if (event?.tags?.dontReportIfPanoramaEnabled) {
										return null
									}

									return event
								}

								// Propagate the unhandled error to the worker so it can be routed by Panorama
								if (hint.originalException instanceof Error) {
									handler(hint.originalException)
									return null
								}

								return event
							})
						})
					},
					onBreadcrumb: (handler: (breadcrumb: any) => void) => {
						window.onBeforeSentryBreadcrumb = handler
					},
				},
			}),
		}
	}
)
