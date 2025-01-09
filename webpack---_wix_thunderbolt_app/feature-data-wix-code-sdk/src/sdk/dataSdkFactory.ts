import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import createWixData from '@wix/wix-data-platformized-client'
import { namespace, DataWixCodeSdkSiteConfig } from '..'

export function DataSdkFactory({
	featureConfig,
	platformUtils: { sessionService },
	appEssentials,
	platformEnvData: { site },
	appDefinitionId,
	blocksAppsUtils,
}: WixCodeApiFactoryArgs<DataWixCodeSdkSiteConfig>) {
	const authHeaderProvider = {
		get() {
			const appInstance = sessionService.getInstance(appDefinitionId)

			if (
				blocksAppsUtils.isBlocksApp(appDefinitionId) &&
				blocksAppsUtils.canAppInstanceBeUsedForAuthorization(appInstance)
			) {
				return appInstance
			}

			return sessionService.getWixCodeInstance()
		},
	}

	const useCloudDataUrlWithExternalBaseUrl = Boolean(
		site.experiments['specs.thunderbolt.UseCloudDataUrlWithBaseExternalUrl']
	)

	const { gridAppId, environment, cloudDataUrl, cloudDataUrlWithExternalBase } = featureConfig

	const { httpClient } = appEssentials

	return {
		[namespace]: createWixData({
			cloudDataUrl: useCloudDataUrlWithExternalBaseUrl ? cloudDataUrlWithExternalBase : cloudDataUrl,
			httpClient,
			gridAppId,
			environment,
			authHeader: authHeaderProvider,
		}),
	}
}
