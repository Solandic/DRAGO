import type { Event } from '@wix/fe-essentials-viewer-platform/sentry/types'
import { StackFrameWithPossibleModuleMetadata } from './types'

export const SENTRY_REROUTED_MARK_KEY = '_REROUTED'
export const SENTRY_IS_TPA_MARK_KEY = '_isTPA'
export const SENTRY_REROUTE_DATA_KEY = '_ROUTE_TO'
export const addRerouteDataToSentryEvent = (event: Event) => {
	if (event?.extra?.[SENTRY_REROUTE_DATA_KEY]) {
		return
	}

	if (event?.exception?.values?.[0].stacktrace?.frames) {
		const frames = event.exception.values[0].stacktrace.frames as Array<StackFrameWithPossibleModuleMetadata>

		// Find the last frame with module metadata containing an appId or dsn
		const framesModuleMetadata = frames
			.filter((frame) => frame.module_metadata && frame.module_metadata.appId)
			.map((v) => ({
				appId: v.module_metadata.appId,
				release: v.module_metadata.release,
				dsn: v.module_metadata.dsn,
			}))

		const routeTo = framesModuleMetadata.slice(-1) // using top frame only

		if (routeTo.length) {
			const app = window.appsWithMonitoring?.find(({ appId }) => appId === routeTo[0].appId)

			if (app) {
				if (!routeTo[0].dsn && app.monitoringComponent) {
					// Take the DSN from DC Monitoring component
					routeTo[0].dsn = app.monitoringComponent.componentFields.monitoring?.sentryOptions?.dsn
				}

				event.extra = {
					...event.extra,
					[SENTRY_IS_TPA_MARK_KEY]: app.isWixTPA === false, // if isWixTPA is not defined, we can't conclude anything. Therefore, the check is for false and not for a falsy value.
				}
			}

			event.extra = {
				...event.extra,
				[SENTRY_REROUTE_DATA_KEY]: routeTo,
				[SENTRY_REROUTED_MARK_KEY]: true,
			}
		}
	}
}
