import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { mobileNamespace, navigationNamespace } from '../symbols'
import type {
	NativeMobileWixCodeSdkHandlers,
	NativeMobileWixCodeSdkWixCodeApi,
	NativeMobileWixCodeSdkSiteConfig,
} from '../types'
import { ToastType, ToastResult, ActionType, ActionSheetResult, NotificationResult } from '../types'

/**
 * This is SDK Factory.
 * Expose your Velo API
 */
export function NativeMobileSdkFactory({
	// featureConfig,
	handlers,
}: WixCodeApiFactoryArgs<
	NativeMobileWixCodeSdkSiteConfig,
	unknown,
	NativeMobileWixCodeSdkHandlers
>): NativeMobileWixCodeSdkWixCodeApi {
	return {
		[navigationNamespace]: {
			dismissAllModals: handlers.navigation.dismissAllModals,
			openURL: handlers.navigation.openURL,
			toScreen: handlers.navigation.toScreen,
			closeScreen: handlers.navigation.closeScreen,
		},
		[mobileNamespace]: {
			showAlert: handlers.systemUi.showAlert,
			appFramework: {
				showToastNotification: (body, toastType = ToastType.INFO, actionLabel) =>
					handlers.systemUi.appFramework.showToastNotification(body, toastType, actionLabel),
				ToastType,
				ToastResult,
				showActionSheet: handlers.systemUi.appFramework.showActionSheet,
				ActionType,
				ActionSheetResult,
				showInAppNotification: handlers.systemUi.appFramework.showInAppNotification,
				NotificationResult,
			},
		},
	}
}
