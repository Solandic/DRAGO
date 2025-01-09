import { serialize, deserialize } from '@wix/cloud-elementory-client-core'
import { errorTypes, errorMessages, ElementorySupportError } from '../errors'
import { getPathWithBaseUrl } from './paths'
import { WebMethodOptions } from '@wix/wix-web-module-definitions'
import type { HttpResponse, IHttpClient } from '@wix/fe-essentials-viewer-platform/http-client'
import type { IPlatformLogger, SessionServiceAPI } from '@wix/thunderbolt-symbols'
import type { Nullable } from '../types'

interface ElementorySupportRequestOptionsHeaders {
	'X-XSRF-TOKEN': string
	Authorization: string
	commonConfig?: string
}

interface ElementorySupportOptions {
	headers: ElementorySupportRequestOptionsHeaders
	timeout?: number
}
type SetHeader = (headerKey: string, headerValue: string) => void

export interface ElementorySupport {
	baseUrl: string
	getQueryParameters: () => string
	getRequestOptions: () => ElementorySupportOptions
	errorTypes: Record<string, string>
	getJSON(
		path: string,
		args: Array<any>,
		calleeAppDefId: Nullable<string>,
		webMethodOptions?: WebMethodOptions
	): Promise<unknown>
	setHeader: SetHeader
	logger: IPlatformLogger
}

const ONE_MINUTE = 60 * 1000

const resolveSerializedArgsWithCacheOptions = (serializedArgs: string, tags: Array<string>, ttl?: number): string => {
	const cacheTagsWithSpaces = tags.join(' ')
	const serializedArgsQuery = serializedArgs ? `&serializedArgs=${encodeURIComponent(serializedArgs)}` : ''
	const cacheTagsQuery = `&tags=${encodeURIComponent(cacheTagsWithSpaces)}`
	const ttlQuery = ttl ? `&ttl=${ttl}` : ''

	return `${serializedArgsQuery}${ttlQuery}${cacheTagsQuery}`
}

const executeWebMethodRequest = async (
	pathWithBaseUrl: string,
	serializedArgs: string,
	allHeaders: Record<string, string>,
	httpClient: IHttpClient,
	isSiteViewMode: boolean,
	webMethodOptions: Nullable<WebMethodOptions>
) => {
	let httpResponse: HttpResponse<string>

	if (isSiteViewMode && webMethodOptions?.cache?.tags.length) {
		const serializedArgsWithTtlAsParams = resolveSerializedArgsWithCacheOptions(
			serializedArgs,
			webMethodOptions.cache.tags,
			webMethodOptions.cache.ttl
		)

		httpResponse = await httpClient.get<string>(`${pathWithBaseUrl}${serializedArgsWithTtlAsParams}`, {
			headers: {
				...allHeaders,
				'x-vcache-req': 'true',
			},
		})
	} else {
		httpResponse = await httpClient.post<string>(pathWithBaseUrl, serializedArgs, {
			headers: allHeaders,
		})
	}
	return httpResponse
}

export default (
	baseUrl: string,
	getQueryParameters: () => string,
	getRequestOptions: () => ElementorySupportOptions,
	httpClient: IHttpClient,
	sessionService: SessionServiceAPI,
	setHeader: SetHeader,
	relativePath: string,
	isSiteViewMode: boolean,
	logger: IPlatformLogger
): ElementorySupport => ({
	baseUrl,
	getQueryParameters,
	getRequestOptions,
	errorTypes,
	logger,
	setHeader,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async getJSON(path: string, args = [], calleeAppDefId = null, webMethodOptions: Nullable<WebMethodOptions> = null) {
		logger.interactionStarted('elementory_support_get_json')
		const queryParameters = getQueryParameters()
		const requestOptions = getRequestOptions()

		const pathWithBaseUrl = getPathWithBaseUrl(baseUrl, path, queryParameters, isSiteViewMode, relativePath)

		const { headers = {}, timeout = ONE_MINUTE } = requestOptions
		const allHeaders = {
			...headers,
			...(calleeAppDefId && { Authorization: sessionService.getInstance(calleeAppDefId) }),
			'Content-Type': 'application/json',
		}

		const buildElementorySupportError = (errorType: string, message = ''): ElementorySupportError =>
			new ElementorySupportError(errorType, message)

		return new Promise(async (resolve, reject) => {
			const abortTimeout = setTimeout(() => {
				reject(buildElementorySupportError(errorTypes.TIMEOUT, errorMessages.TIMEOUT_ERROR_MESSAGE))
			}, timeout)

			try {
				const serializedArgs = serialize(args)
				const httpResponse = await executeWebMethodRequest(
					pathWithBaseUrl,
					serializedArgs,
					allHeaders,
					httpClient,
					isSiteViewMode,
					webMethodOptions
				)
				clearTimeout(abortTimeout)
				try {
					const httpResponseData = deserialize(JSON.stringify(httpResponse.data))
					logger.interactionEnded('elementory_support_get_json')
					const { isError, payload } = httpResponseData

					if (isError) {
						const error = payload || new Error(errorMessages.DEFAULT_WEB_METHOD_ERROR_MESSAGE)
						reject(error)
					} else {
						resolve(payload)
					}
				} catch (error) {
					reject(buildElementorySupportError(errorTypes.PARSE, error.message))
				}
			} catch (error) {
				reject(buildElementorySupportError(errorTypes.ERROR, error.message))
			}
		})
	},
})
