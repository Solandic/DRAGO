import pako from 'pako'

import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	SiteFeatureConfigSymbol,
	RouterFetchData,
	ISessionManager,
	IMultilingual,
	BrowserWindow,
	BrowserWindowSymbol,
	LoggerSymbol,
} from '@wix/thunderbolt-symbols'
import { FetchParams } from 'feature-router'
import { SessionManagerSymbol } from 'feature-session-manager'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'
import { MultilingualSymbol } from 'feature-multilingual'
import { getCSRFToken, isSSR, yieldToMain } from '@wix/thunderbolt-commons'
import type { RouterFetchRequestTypes, RouterFetchAPI, RouterFetchAdditionalData, RouterFetchSiteConfig } from './types'
import { name } from './symbols'
import type { ILogger } from '@wix/thunderbolt-types/logger'

const addQueryParam = (url: string, paramName: string, paramValue: string): string => {
	const parsedUrl = new URL(url)
	parsedUrl.searchParams.append(paramName, paramValue)

	return parsedUrl.toString()
}

const MAX_URL_LENGTH = 2048

export const RouterFetch = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		SessionManagerSymbol,
		CommonConfigSymbol,
		BrowserWindowSymbol,
		LoggerSymbol,
		optional(MultilingualSymbol),
	],
	(
		{ externalBaseUrl, viewMode }: RouterFetchSiteConfig,
		sessionManager: ISessionManager,
		commonConfigAPI: ICommonConfig,
		window: BrowserWindow,
		logger: ILogger,
		multiLingual?: IMultilingual
	): RouterFetchAPI => {
		const getHeaders = (routerFetchData: RouterFetchData) => {
			const authorizationHeader = sessionManager.getAppInstanceByAppDefId(routerFetchData.wixCodeAppDefinitionId)
			if (authorizationHeader) {
				routerFetchData.optionsData.headers!['Authorization' as string] = authorizationHeader
			}
			if (!isSSR(window)) {
				routerFetchData.optionsData.headers!['X-XSRF-TOKEN' as string] = getCSRFToken(window?.document?.cookie)
			}

			// Hard coded UUID for multilingual support https://wix.slack.com/archives/C04BFK71QHW/p1676992832913939 .
			const multiLingualUUID = '00000000-0000-0000-0000-000000000000'

			return {
				...(process.env.PACKAGE_NAME === 'thunderbolt-ds'
					? {}
					: { commonConfig: JSON.stringify(commonConfigAPI.getCommonConfig()) }),
				...routerFetchData.optionsData.headers,
				...(multiLingual
					? {
							'x-wix-linguist': `${multiLingual!.currentLanguage.languageCode}|${
								multiLingual!.currentLanguage.locale
							}|${multiLingual!.currentLanguage.isPrimaryLanguage}|${multiLingualUUID}`,
					  }
					: {}),
			}
		}

		const getData = (routerFetchData: RouterFetchData, additionalData: RouterFetchAdditionalData): string => {
			const { routerPrefix, config, pageRoles, roleVariations } = routerFetchData.optionsData.bodyData
			const commonData = {
				routerPrefix,
				config,
				pageRoles,
				requestInfo: {
					env: process.env.browser ? 'browser' : 'backend',
					formFactor: viewMode,
				},
			}

			if ('lightboxId' in additionalData) {
				const { lightboxId } = additionalData
				return JSON.stringify({ ...commonData, lightboxId })
			} else {
				const { routerSuffix, queryParams, dynamicPageIdOverride } = additionalData

				const fullUrl = dynamicPageIdOverride
					? `${externalBaseUrl}${routerPrefix}${routerSuffix}${queryParams}&dynamicPageIdOverride=${dynamicPageIdOverride}`
					: `${externalBaseUrl}${routerPrefix}${routerSuffix}${queryParams}`

				return JSON.stringify({ ...commonData, routerSuffix, fullUrl, roleVariations, dynamicPageIdOverride })
			}
		}

		const jsonStringifyGzipBase64 = async (obj: object, onErrorCallback?: Function): Promise<string> => {
			try {
				const jsonString = JSON.stringify(obj)

				// We need to yield to the main thread to avoid blocking when we compress
				await yieldToMain()

				const compressedData = pako.gzip(jsonString)

				const base64String = btoa(String.fromCharCode(...new Uint8Array(compressedData)))

				return base64String
			} catch (error) {
				if (onErrorCallback) {
					onErrorCallback(error)
				}
				return ''
			}
		}

		const getFetchParams = (
			requestType: RouterFetchRequestTypes,
			routerFetchData: RouterFetchData,
			additionalData: RouterFetchAdditionalData
		): FetchParams => {
			const { basePath, queryParams, appDefinitionId } = routerFetchData.urlData
			const data = getData(routerFetchData, additionalData)

			const url = `${basePath}/${requestType}?${queryParams}`
			const instance = sessionManager.getAppInstanceByAppDefId(appDefinitionId) as string
			const urlWithInstance = addQueryParam(url, 'instance', instance)

			return {
				url: urlWithInstance,
				options: {
					method: 'POST',
					headers: getHeaders(routerFetchData),
					body: data,
					...(routerFetchData.optionsData.credentials
						? { credentials: routerFetchData.optionsData.credentials }
						: {}),
					...(routerFetchData.optionsData.mode ? { mode: routerFetchData.optionsData.mode } : {}),
				},
			}
		}

		const shouldSendGETRequest = (routerFetchData: RouterFetchData): boolean => {
			return !!(process.env.PACKAGE_NAME !== 'thunderbolt-ds' && routerFetchData.urlData.fetchUsingGet)
		}

		const compressBody = async (urlParams: object, data: string): Promise<string | null> => {
			return jsonStringifyGzipBase64(
				{
					urlParams,
					body: JSON.parse(data),
				},
				(error: Error) => {
					logger.meter('compressed-body-error', {
						customParams: {
							errorCompress: error,
						},
					})
				}
			)
		}

		const handleGetRequestFetchParams = async (
			requestUrl: URL,
			requestHeaders: HeadersInit,
			routerFetchData: RouterFetchData,
			additionalData: RouterFetchAdditionalData
		): Promise<FetchParams | null> => {
			const urlParams = Object.fromEntries(requestUrl.searchParams)
			const data = getData(routerFetchData, additionalData)

			let getRequestQueryParams: string | null = ''

			if (routerFetchData.urlData.compressPayload) {
				getRequestQueryParams = await compressBody(urlParams, data)
			} else {
				urlParams.payload = data
				getRequestQueryParams = new URLSearchParams(urlParams).toString()
			}

			if (getRequestQueryParams) {
				const fetchUrl = `${requestUrl.origin}${requestUrl.pathname}?${getRequestQueryParams}`

				// Checking we are not exceeding the max length of the URL
				if (fetchUrl?.length <= MAX_URL_LENGTH) {
					const fetchOptions = { method: 'GET', headers: requestHeaders }
					return {
						url: fetchUrl,
						options: fetchOptions,
					}
				}

				logger.meter('compressed-body-too-large', {
					customParams: {
						compressedEncodedBodyLength: getRequestQueryParams.length,
					},
				})
			}

			return null
		}

		// This function will try to get the fetch params with a GET request if possible
		// If not possible, it will return the fetch params with a POST request
		const tryToGetCachableFetchParams = async (
			requestType: RouterFetchRequestTypes,
			routerFetchData: RouterFetchData,
			additionalData: RouterFetchAdditionalData
		): Promise<FetchParams> => {
			if (shouldSendGETRequest(routerFetchData)) {
				const { basePath, queryParams } = routerFetchData.urlData
				const url = `${basePath}/${requestType}?${queryParams}`
				const requestUrl = new URL(url)
				const requestHeaders = getHeaders(routerFetchData)
				const fetchParams = await handleGetRequestFetchParams(
					requestUrl,
					requestHeaders,
					routerFetchData,
					additionalData
				)
				if (fetchParams) {
					return fetchParams
				}
			}
			// Return the fetch params with a POST request
			return getFetchParams(requestType, routerFetchData, additionalData)
		}

		return {
			getFetchParams,
			tryToGetCachableFetchParams,
		}
	}
)
