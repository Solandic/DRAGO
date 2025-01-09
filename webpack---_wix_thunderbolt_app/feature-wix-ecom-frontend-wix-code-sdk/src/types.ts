import { IPlatformUtils } from '@wix/thunderbolt-symbols'

export interface WixEcomFrontendWixCodeSdkWixCodeApi {
	someKey: string
	doSomething(): void
	refreshCart(): Promise<void>
	onCartChange(handler: () => void): void
	openSideCart(): void
	navigateToCartPage(): Promise<any>
	navigateToCheckoutPage(
		checkoutId: string,
		options?: {
			skipDeliveryStep?: boolean
			hideContinueShoppingButton?: boolean
			overrideContinueShoppingUrl?: string
			overrideThankYouPageUrl?: string
		}
	): Promise<any>
}

export interface WixEcomFrontendWixCodeSdkHandlers extends Record<string, Function> {
	doSomething: () => void
}

/**
 * Site feature config is calculated in SSR when creating the `viewerModel`
 * The config is available to your feature by injecting `named(PageFeatureConfigSymbol, name)`
 */
export type WixEcomFrontendWixCodeSdkSiteConfig = {
	someKey: string
}

export interface CreateBiLoggerParams {
	biUtils: IPlatformUtils['biUtils']
	msid: string
}

export enum MethodNames {
	refreshCart = 'refreshCart',
	onCartChange = 'onCartChange',
	openSideCart = 'openSideCart',
	navigateToCartPage = 'navigateToCartPage',
	navigateToCheckoutPage = 'navigateToCheckoutPage',
}
