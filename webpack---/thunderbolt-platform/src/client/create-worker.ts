const {
	viewerModel: {
		siteAssets: { clientTopology },
		siteFeatures,
		siteFeaturesConfigs: { platform },
		site: { externalBaseUrl },
	},
	usedPlatformApis,
} = window

const shouldCreateWebWorker = Worker && siteFeatures.includes('platform')

const createWorkerBlobUrl = (workerUrl: string) => {
	const blob = new Blob([`importScripts('${workerUrl}');`], { type: 'application/javascript' })
	return URL.createObjectURL(blob)
}

const createWorker = async () => {
	const starMark = 'platform_create-worker started'
	performance.mark(starMark)

	const { clientWorkerUrl, appsScripts, bootstrapData, sdksStaticPaths } = platform
	const { appsSpecData, appDefIdToIsMigratedToGetPlatformApi, forceEmptySdks } = bootstrapData
	const url =
		clientWorkerUrl.startsWith('http://localhost:') || clientWorkerUrl.startsWith('https://bo.wix.com/suricate/') || document.baseURI !== location.href
			? createWorkerBlobUrl(clientWorkerUrl)
			: clientWorkerUrl.replace(clientTopology.fileRepoUrl, `${externalBaseUrl}/_partials`)

	const platformWorker = new Worker(url)
	const nonFederatedAppsOnPageScriptsUrls = Object.keys(appsScripts.urls)
		.filter((id) => !appsSpecData[id]?.isModuleFederated)
		.reduce((appsScriptsUrls: typeof appsScripts.urls, id) => {
			appsScriptsUrls[id] = appsScripts.urls[id]
			return appsScriptsUrls
		}, {})

	if (sdksStaticPaths && sdksStaticPaths.mainSdks && sdksStaticPaths.nonMainSdks) {
		const areAllAppsMigratedToGetPlatformApi = Object.values(appDefIdToIsMigratedToGetPlatformApi).every((x) => x)
		if (areAllAppsMigratedToGetPlatformApi || forceEmptySdks) {
			platformWorker.postMessage({
				type: 'preloadNamespaces',
				namespaces: usedPlatformApis,
			})
		} else {
			platformWorker.postMessage({
				type: 'preloadAllNamespaces',
				sdksStaticPaths,
			})
		}
	}

	platformWorker.postMessage({
		type: 'platformScriptsToPreload',
		appScriptsUrls: nonFederatedAppsOnPageScriptsUrls,
	})

	const endMark = 'platform_create-worker ended'
	performance.mark(endMark)
	performance.measure('Create Platform Web Worker', starMark, endMark)

	return platformWorker
}

export const platformWorkerPromise = shouldCreateWebWorker ? createWorker() : Promise.resolve()
