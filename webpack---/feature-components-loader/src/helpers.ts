import { ViewerModel } from '@wix/thunderbolt-symbols'

export const isLazyLoadCompatible = (viewerModel: ViewerModel) =>
	viewerModel.react18Compatible &&
	!isIFrame() &&
	process.env.PACKAGE_NAME !== 'thunderbolt-ds' &&
	process.env.RENDERER_BUILD !== 'react-native'

export const isIFrame = (): boolean => {
	try {
		return window.self !== window.top
	} catch (e) {
		// empty
	}
	return false
}
