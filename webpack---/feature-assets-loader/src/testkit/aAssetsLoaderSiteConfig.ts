import { AssetsLoaderSiteConfig } from '../types'

export const aAssetsLoaderSiteConfig = (
	partialSiteConfig: Partial<AssetsLoaderSiteConfig> = {}
): AssetsLoaderSiteConfig => ({
	isStylableComponentInStructure: false,
	...partialSiteConfig,
})
