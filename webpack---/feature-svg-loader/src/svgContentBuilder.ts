import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { Fetch, IFetchApi, LoggerSymbol, PageFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { vectorImage } from '@wix/thunderbolt-commons'
import { name } from './symbols'
import type { ILogger } from '@wix/thunderbolt-types/logger'
import type { ISvgContentBuilder, SvgLoaderPageConfig } from './types'

export const SvgContentBuilder = withDependencies(
	[named(PageFeatureConfigSymbol, name), Fetch, LoggerSymbol],
	(pageFeatureConfig: SvgLoaderPageConfig, fetchAPI: IFetchApi, logger: ILogger): ISvgContentBuilder => {
		const { buildSvgUrl } = vectorImage.buildSvgUrlFactory()
		return async ({ svgId, transformationOptions, compId }) => {
			const url = buildSvgUrl(pageFeatureConfig.mediaRootUrl, svgId)
			const logErrorAndReturnFallbackSvg = (error: any) => {
				logger?.captureError(error, {
					tags: { feature: 'svgContentBuilder', compId },
				})

				return {
					svgStringResult: `<svg data-svg-id="fallback-${svgId}" />`,
				}
			}

			try {
				const svgStringRes = await fetchAPI.envFetch(url)

				if (!svgStringRes.ok) {
					const errorText = await svgStringRes.text()
					return logErrorAndReturnFallbackSvg(errorText)
				}

				const rawSvgString = await svgStringRes.text()
				const { info: svgInfo } = vectorImage.parseSvgString(rawSvgString)

				return {
					svgStringResult: transformationOptions
						? vectorImage.transformVectorImage(rawSvgString, {
								...transformationOptions,
								svgId,
								compId,
								svgInfo,
								colorsMap: pageFeatureConfig.colorsMap,
						  })
						: rawSvgString,
					svgInfo,
				}
			} catch (e) {
				return logErrorAndReturnFallbackSvg(e)
			}
		}
	}
)
