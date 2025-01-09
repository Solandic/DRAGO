import type { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import type { ElementorySupportWixCodeSdkWixCodeApi, ElementoryWixCodeSdkSiteConfig } from '../types'
import { namespace } from '../symbols'
import elementorySupport from './elementorySupport'
import { createElementorySupportQueryParams } from './queryParams'

export const ElementorySupportSdkFactory = ({
	featureConfig,
	platformUtils: { sessionService },
	appEssentials: { httpClient },
	platformEnvData: {
		window: { csrfToken },
		site,
		mainGridAppId,
	},
	appDefinitionId,
	blocksAppsUtils,
	logger,
}: WixCodeApiFactoryArgs<ElementoryWixCodeSdkSiteConfig>): {
	[namespace]: ElementorySupportWixCodeSdkWixCodeApi
} => {
	function getSignedInstance() {
		if (!blocksAppsUtils.isBlocksSignedInstanceExperimentOpen()) {
			return sessionService.getWixCodeInstance()
		}

		const appInstance = sessionService.getInstance(appDefinitionId)
		const isBlocksApp = blocksAppsUtils.isBlocksApp(appDefinitionId)

		if (isBlocksApp && blocksAppsUtils.canAppInstanceBeUsedForAuthorization(appInstance)) {
			return appInstance
		}

		return sessionService.getWixCodeInstance()
	}

	const { viewMode, baseUrl, relativePath, gridAppId, siteRevision } = featureConfig
	const isSiteViewMode = viewMode === 'site'

	const additionalHeaders: Record<string, string> = {}
	const overrideGridAppId = mainGridAppId || gridAppId

	const instance =
		isSiteViewMode && Boolean(site.experiments['specs.thunderbolt.excludeInstanceFromQueryParams'])
			? ''
			: getSignedInstance()

	const getQueryParameters = () => createElementorySupportQueryParams(overrideGridAppId, viewMode, instance)

	const getRequestOptions = () => ({
		headers: {
			'X-XSRF-TOKEN': csrfToken,
			'x-wix-site-revision': siteRevision.toString(),
			'x-wix-app-instance': sessionService.getInstance(appDefinitionId),
			Authorization: getSignedInstance(),
			...additionalHeaders,
		},
	})

	const setHeader = (headerKey: string, headerValue: string) => {
		additionalHeaders[headerKey] = headerValue
	}

	return {
		[namespace]: elementorySupport(
			baseUrl,
			getQueryParameters,
			getRequestOptions,
			httpClient,
			sessionService,
			setHeader,
			relativePath,
			isSiteViewMode,
			logger
		),
	}
}
