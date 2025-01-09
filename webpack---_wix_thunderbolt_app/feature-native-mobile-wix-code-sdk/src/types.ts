import { navigationNamespace, mobileNamespace } from './symbols'

export type AlertAction = {
	key: string
	label: string
	destructive?: string
}

export type ShowAlert = (
	title: string,
	body: string,
	actions: {
		positive: AlertAction
		negative?: AlertAction
		neutral?: AlertAction
	}
) => Promise<{ dismissed: boolean; key?: string }>

export enum ToastType {
	INFO = 'general',
	SUCCESS = 'success',
	FAILURE = 'failure',
	OFFLINE = 'offline',
}
export enum ToastResult {
	PRESSED = 'pressed',
	DISMISSED = 'dismissed',
}

export type ShowAlertType = (
	title: string,
	body: string,
	actions: {
		positive: AlertAction
		negative?: AlertAction
		neutral?: AlertAction
	}
) => Promise<{ dismissed: boolean; key?: string }>

export type ShowToastNotification = (
	body: string,
	type?: ToastType,
	actionLabel?: string
) => Promise<{ result: ToastResult }>

export enum ActionSheetResult {
	ACTION_SELECTED = 'actionSelected',
	DISMISSED = 'dismissed',
}

export enum ActionType {
	DEFAULT = 'default',
	PROMINENT = 'prominent',
	DESTRUCTIVE = 'destructive',
	CANCEL = 'cancel',
}

export type ActionsSheetAction = {
	key: string
	title: string
	subtitle?: string
	icon?: string
	type?: ActionType
}

export type ActionSheetHeaderProps = {
	title: string
	subtitle?: string
}

export type ShowActionSheetResult =
	| { result: ActionSheetResult.ACTION_SELECTED; actionKey: string }
	| { result: ActionSheetResult.DISMISSED }

export type ShowActionSheet = (
	actions: Array<ActionsSheetAction>,
	headerProps?: ActionSheetHeaderProps
) => Promise<ShowActionSheetResult>

export type InAppNotificationOptions = Partial<Record<'title' | 'avatarImage' | 'image', string>>

export enum NotificationResult {
	PRESSED = 'pressed',
	DISMISSED = 'dismissed',
}

export type ShowInAppNotification = (
	body: string,
	options?: InAppNotificationOptions
) => Promise<{ result: NotificationResult }>

type NativeMobileWixCodeNavigationApi = {
	dismissAllModals: () => void
	openURL: (url: string) => Promise<void>
	toScreen: (slug: string) => Promise<any>
	closeScreen: (data: any) => Promise<any>
}

type NativeMobileWixCodeSystemUiUserApi = {
	showAlert: ShowAlert
	appFramework: {
		showToastNotification: ShowToastNotification
		ToastType: typeof ToastType
		ToastResult: typeof ToastResult
		showActionSheet: ShowActionSheet
		ActionType: typeof ActionType
		ActionSheetResult: typeof ActionSheetResult
		showInAppNotification: ShowInAppNotification
		NotificationResult: typeof NotificationResult
	}
}

type NativeMobileWixCodeSystemUiInternalApi = {
	showAlert: ShowAlert
	appFramework: {
		showToastNotification: ShowToastNotification
		showActionSheet: ShowActionSheet
		showInAppNotification: ShowInAppNotification
	}
}

// User Interface Type
export type NativeMobileWixCodeSdkWixCodeApi = {
	[navigationNamespace]: NativeMobileWixCodeNavigationApi
	[mobileNamespace]: NativeMobileWixCodeSystemUiUserApi
}

// Internal Handlers Type
export type NativeMobileWixCodeSdkHandlers = {
	navigation: NativeMobileWixCodeNavigationApi
	systemUi: NativeMobileWixCodeSystemUiInternalApi
}

/**
 * Site feature config is calculated in SSR when creating the `viewerModel`
 * The config is available to your feature by injecting `named(PageFeatureConfigSymbol, name)`
 */
export type NativeMobileWixCodeSdkSiteConfig = {}

export type NativeMobileApis = Partial<{
	navigation: NativeMobileWixCodeNavigationApi
	systemUi: NativeMobileWixCodeSystemUiInternalApi
}>
