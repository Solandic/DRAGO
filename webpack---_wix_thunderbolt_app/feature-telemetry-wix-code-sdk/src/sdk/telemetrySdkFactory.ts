import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { createFedopsLogger } from '@wix/thunderbolt-commons'
import { namespace } from '../symbols'
import { createConsoleProxy } from './createConsoleProxy'
import { TelemetryWixCodeSdkWixCodeApi, TelemetryConsole } from '../types'
import { sendConsoleMessagesToEditor } from './sendConsoleMessagesToEditor'
import { createSiteMonitoringService } from './createSiteMonitoringService'
import { sendConsoleMessagesToSiteMonitoring } from './sendConsoleMessagesToSiteMonitoring'

export const TelemetrySdkFactory = ({
	wixCodeNamespacesRegistry,
	platformEnvData,
	platformUtils,
	onPageWillUnmount,
	appEssentials,
}: WixCodeApiFactoryArgs): {
	[namespace]: TelemetryWixCodeSdkWixCodeApi
} => {
	const { bi } = platformEnvData
	let consoleProxy: TelemetryConsole

	const { httpClient } = appEssentials

	return {
		[namespace]: {
			get console() {
				if (!consoleProxy) {
					const wixCodeSiteSdk = wixCodeNamespacesRegistry.get('site')

					const siteUrl = platformEnvData.location.externalBaseUrl
					const viewMode = platformEnvData.site.viewMode
					const baseUrl = viewMode === 'Site' ? siteUrl : platformUtils.clientSpecMapApi.getWixCodeBaseUrl()
					const metaSiteId = platformEnvData.location.metaSiteId
					const instance = platformUtils.sessionService.getWixCodeInstance()
					const revision = wixCodeSiteSdk.revision
					const fedopsLogger = createFedopsLogger({
						appName: 'telemetry-wix-code-sdk',
						biLoggerFactory: platformUtils.biUtils.createBiLoggerFactoryForFedops(),
						customParams: {
							viewerName: 'thunderbolt',
						},
						factory: platformUtils.essentials.createFedopsLogger,
						experiments: platformUtils.essentials.experiments.all(),
						monitoringData: {
							metaSiteId: platformEnvData.location.metaSiteId,
							dc: bi.dc,
							isHeadless: bi.isjp, // name is weird because legacy
							isCached: bi.isCached,
							rolloutData: bi.rolloutData,
							viewerSessionId: bi.viewerSessionId,
						},
					})

					const getPageName = (): null | string => {
						const customParams = {
							baseUrl,
							metaSiteId,
							instance,
							siteUrl,
							viewMode,
							revision,
						}

						try {
							fedopsLogger.interactionStarted('get-page-name', { customParams })
							const { pageIdToTitle } = platformEnvData.site
							const { pageId } = bi.pageData

							const pageName = pageIdToTitle[pageId]

							if (pageName === undefined) {
								throw new Error(`Page ${pageId} name is undefined`)
							}

							fedopsLogger.interactionEnded('get-page-name', {
								customParams: {
									...customParams,
									status: 'success',
								},
							})

							return pageName
						} catch (error) {
							fedopsLogger.interactionStarted('get-page-name-error', {
								paramsOverrides: {
									evid: '26',
									errorInfo: error.message,
									eventString: 'error',
								},
								customParams: {
									...customParams,
									status: 'error',
									error: error.message,
								},
							})
							return null
						}
					}

					const siteMonitoringService = createSiteMonitoringService({
						baseUrl,
						metaSiteId,
						instance,
						siteUrl,
						viewMode,
						revision,
						fedopsLogger,
						httpClient,
						pageName: getPageName(),
					})

					const { onLog, proxy } = createConsoleProxy(console)

					consoleProxy = proxy

					if (process.env.PACKAGE_NAME === 'thunderbolt-ds') {
						const unregister = onLog(sendConsoleMessagesToEditor(wixCodeSiteSdk))
						onPageWillUnmount(unregister)
					}

					if (!platformEnvData.window.isSSR) {
						const unregister = onLog(sendConsoleMessagesToSiteMonitoring(siteMonitoringService))
						onPageWillUnmount(unregister)
					}
				}

				return consoleProxy
			},
		},
	}
}
