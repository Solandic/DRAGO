import { presetsTypes } from '@wix/fedops-presets'
import type { ViewerPlatformEssentials } from '@wix/fe-essentials-viewer-platform'
import type { FedopsConfig, Experiments } from '@wix/thunderbolt-symbols'
import {
	AppsMutingWhiteList,
	EVENTS_REPORTED_TO_BI,
	MUTING_LIST,
	UNSAMPLED_EVENTS,
	APP_NAME_FEDOPS_WHITELIST,
} from './constants'
// eslint-disable-next-line no-restricted-syntax
import type { FedopsLogger, IAppIdentifier } from '@wix/fedops-logger'
import { PanoramaPlatform, panoramaClientFactory } from '@wix/fe-essentials-viewer-platform/panorama-client'
import { getPanoramaGlobalConfig } from './panoramaConfig'
import { isExperimentOpen } from '../experiments'

export type FedopsFactory = ViewerPlatformEssentials['createFedopsLogger']

export const createFedopsLogger = ({
	biLoggerFactory,
	customParams = {},
	phasesConfig = 'SEND_ON_FINISH',
	appName = 'thunderbolt',
	presetType = process.env.PACKAGE_NAME === 'thunderbolt-ds' ? presetsTypes.DS : presetsTypes.BOLT,
	reportBlackbox = false,
	paramsOverrides = {},
	factory,
	muteThunderboltEvents = false,
	experiments = {},
	monitoringData,
}: FedopsConfig & {
	factory: FedopsFactory
	experiments?: Experiments
	monitoringData: {
		metaSiteId: string
		dc: string
		isHeadless: boolean
		isCached: boolean
		viewerSessionId: string
		rolloutData: {
			siteAssetsVersionsRollout: boolean
			isDACRollout: boolean
			isTBRollout?: boolean
		}
	}
}): FedopsLogger => {
	const fedopsLogger = factory(appName, {
		presetType,
		phasesConfig,
		isPersistent: true,
		isServerSide: !process.env.browser,
		reportBlackbox,
		customParams,
		biLoggerFactory,
		// @ts-ignore FEDINF-3725
		paramsOverrides,
		enableSampleRateForAppNames:
			isExperimentOpen('specs.thunderbolt.fedops_enableSampleRateForAppNames', experiments) ??
			(typeof window !== 'undefined' &&
				isExperimentOpen(
					'specs.thunderbolt.fedops_enableSampleRateForAppNames',
					window?.viewerModel?.experiments
				)),
	})

	const {
		interactionStarted,
		interactionEnded,
		appLoadingPhaseStart,
		appLoadingPhaseFinish,
		appLoadStarted,
		appLoaded,
	} = fedopsLogger

	const isFedopsErrorMutingExperimentOpen = isExperimentOpen('specs.thunderbolt.fedopsMuteErrors', experiments)

	const isWorker = () => process.env.browser && typeof window === 'undefined' // TODO: fix

	const isErrorReport = (overrides?: { evid?: string }) => overrides?.evid && parseInt(overrides.evid, 10) === 26

	const getPanoramaClient = () => {
		if (!process.env.browser) {
			return null
		}

		const config = getPanoramaGlobalConfig()

		if (monitoringData?.viewerSessionId) {
			config.setSessionId(monitoringData.viewerSessionId)
		}

		const msid = monitoringData?.metaSiteId ?? ''
		const dataCenter = monitoringData?.dc ?? ''
		const isHeadless = !!monitoringData?.isHeadless
		const isCached = !!monitoringData?.isCached
		const isRollout = !!monitoringData?.rolloutData?.isTBRollout
		const isDacRollout = !!monitoringData?.rolloutData?.isDACRollout
		const isSavRollout = !!monitoringData?.rolloutData?.siteAssetsVersionsRollout

		const panorama = panoramaClientFactory({
			baseParams: {
				platform: PanoramaPlatform.Viewer,
				msid,
				fullArtifactId: 'com.wixpress.html-client.wix-thunderbolt',
				componentId: appName,
			},
			pluginParams: {
				useBatch: !!process.env.browser,
			},
			data: {
				dataCenter,
				isHeadless,
				isCached,
				isRollout,
				isDacRollout,
				isSavRollout,
				isSsr: !process.env.browser,
				presetType,
				customParams,
			},
			reporterOptions: {
				fetchFn: fetch,
			},
		}).withGlobalConfig(config)

		return panorama.client()
	}

	const panoramaClient = getPanoramaClient()

	const reportPanoramaLoad = (isStartEvent: boolean) => {
		if (!panoramaClient || isWorker()) {
			return
		}

		if (isStartEvent) {
			panoramaClient.reportLoadStart()
		} else {
			panoramaClient.reportLoadFinish()
		}
	}

	const reportPanoramaError = (overrides: { errorInfo?: string; errorType?: string } = {}) => {
		if (!panoramaClient) {
			return
		}

		const { errorInfo, errorType } = overrides
		const error = new Error(errorInfo)

		panoramaClient?.errorMonitor().reportError(error, {
			errorName: errorType,
			environment: 'Viewer',
		})
	}

	const reportPanoramaTransaction = (eventName: string, isStartEvent: boolean) => {
		if (!panoramaClient) {
			return
		}

		const eventNameWithoutSpaces = eventName.replaceAll(' ', '_')

		if (isStartEvent) {
			panoramaClient.transaction(eventNameWithoutSpaces).start()
		} else {
			panoramaClient.transaction(eventNameWithoutSpaces).finish()
		}
	}

	const shouldEventAlwaysReportToBi = (event: string, overrides: any, isInteraction: boolean) => {
		const siteAssetsModule = overrides?.siteAssetsModule ?? ''
		const whitelistedSiteAssets = ['thunderbolt-css', 'thunderbolt-features', 'thunderbolt-platform']
		const isEventIsInTheMutingRange = presetType === presetsTypes.BOLT

		return (
			!isEventIsInTheMutingRange ||
			EVENTS_REPORTED_TO_BI.has(event) ||
			(isInteraction && whitelistedSiteAssets.includes(siteAssetsModule))
		)
	}

	const shouldMuteEvent = (event: string, isInteraction: boolean, overrides?: any): boolean => {
		// always report events in react-native build for performance effort
		if (process.env.RENDERER_BUILD === 'react-native') {
			return false
		}
		if (isErrorReport(overrides)) {
			return isFedopsErrorMutingExperimentOpen
		}
		return !shouldEventAlwaysReportToBi(event, overrides, isInteraction)
	}

	const shouldReportToFedops = (
		event: string,
		isInteraction: boolean,
		params?: IAppIdentifier,
		overrides?: any
	): boolean => {
		// Early return for whitelisted apps
		if (APP_NAME_FEDOPS_WHITELIST.has(appName)) {
			return true
		}

		// Early return for muted events
		if (shouldMuteEvent(event, isInteraction, overrides)) {
			return false
		}

		// Early return for site assets module
		if (overrides?.siteAssetsModule) {
			return true
		}

		const appShouldReportAll = params?.appId ? !AppsMutingWhiteList.has(params.appId) : false
		const shouldAlwaysReportEvent = UNSAMPLED_EVENTS.has(event)
		const shouldAlwaysMuteEvent = MUTING_LIST.has(event)

		return shouldAlwaysReportEvent || appShouldReportAll || (!shouldAlwaysMuteEvent && !muteThunderboltEvents)
	}

	// This is done this way because FedopsLogger is a class and not an Object,
	// Therefor if we return an object it will crash because it operates on 'this' which does not exist in an object
	// so we can't make it immutable.

	fedopsLogger.interactionStarted = (interaction: string, params?) => {
		if (isErrorReport(params?.paramsOverrides)) {
			reportPanoramaError(params?.paramsOverrides)
		} else if (!isWorker()) {
			reportPanoramaTransaction(interaction, true)
		}

		if (shouldReportToFedops(interaction, true, undefined, params?.paramsOverrides)) {
			return interactionStarted.call(fedopsLogger, interaction, params)
		} else {
			try {
				performance.mark(`${interaction} started`)
			} catch {}
		}
		return { timeoutId: 0 }
	}

	fedopsLogger.interactionEnded = (interaction: string, params?) => {
		if (!isWorker()) {
			reportPanoramaTransaction(interaction, false)
		}

		if (shouldReportToFedops(interaction, true, undefined, params?.paramsOverrides)) {
			interactionEnded.call(fedopsLogger, interaction, params)
		} else {
			try {
				performance.mark(`${interaction} ended`)
			} catch {}
		}
	}

	fedopsLogger.appLoadingPhaseStart = (phase: string, params?: IAppIdentifier) => {
		reportPanoramaTransaction(phase, true) // Will also report from worker

		if (shouldReportToFedops(phase, false, params)) {
			appLoadingPhaseStart.call(fedopsLogger, phase, params)
		} else {
			try {
				performance.mark(`${phase} started`)
			} catch {}
		}
	}

	fedopsLogger.appLoadingPhaseFinish = (phase: string, params?: IAppIdentifier, options?: any) => {
		reportPanoramaTransaction(phase, false) // Will also report from worker

		if (shouldReportToFedops(phase, false, params)) {
			appLoadingPhaseFinish.call(fedopsLogger, phase, params, options)
		} else {
			try {
				performance.mark(`${phase} finished`)
			} catch {}
		}
	}

	fedopsLogger.appLoadStarted = (params) => {
		reportPanoramaLoad(true)
		appLoadStarted.call(fedopsLogger, params)
	}

	fedopsLogger.appLoaded = (params) => {
		reportPanoramaLoad(false)
		appLoaded.call(fedopsLogger, params)
	}
	return fedopsLogger
}
