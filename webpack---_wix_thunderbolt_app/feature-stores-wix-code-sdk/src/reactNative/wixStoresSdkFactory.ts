import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, StoresWixCodeSdkHandlers, WixStoresWixCodeSdkWixCodeApi } from '..'

function getNotImplementedErrorMessage(apiName: string) {
	return `ERROR: API ${apiName} is not supported within mobile apps`
}

export function WixNativeMobileStoresSdkFactory({
	handlers,
}: WixCodeApiFactoryArgs<object, unknown, StoresWixCodeSdkHandlers>): { [namespace]: WixStoresWixCodeSdkWixCodeApi } {
	return {
		[namespace]: {
			async getProductOptionsAvailability(): Promise<any> {
				console.error(getNotImplementedErrorMessage('getProductOptionsAvailability'))
			},
			async getProductVariants(): Promise<any> {
				console.error(getNotImplementedErrorMessage('getProductVariants'))
			},
			async getCurrentCart(): Promise<any> {
				console.error(getNotImplementedErrorMessage('getCurrentCart'))
			},
			onCartChanged() {
				console.error(getNotImplementedErrorMessage('onCartChanged'))
			},
			removeProductFromCart(): Promise<any> {
				const message = getNotImplementedErrorMessage('removeProductFromCart')
				console.error(message)
				throw new Error(message)
			},
			addCustomItemsToCart(): Promise<any> {
				const message = getNotImplementedErrorMessage('addCustomItemsToCart')
				console.error(message)
				throw new Error(message)
			},
			product: {
				async getOptionsAvailability(): Promise<any> {
					console.error(getNotImplementedErrorMessage('product.getOptionsAvailability'))
				},
				async getVariants(): Promise<any> {
					console.error(getNotImplementedErrorMessage('product.getVariants'))
				},
				async openQuickView(): Promise<any> {
					console.error(getNotImplementedErrorMessage('product.openQuickView'))
				},
			},
			cart: {
				applyCoupon(): Promise<any> {
					const message = getNotImplementedErrorMessage('cart.applyCoupon')
					console.error(message)
					throw new Error(message)
				},
				removeCoupon(): Promise<any> {
					const message = getNotImplementedErrorMessage('cart.removeCoupon')
					console.error(message)
					throw new Error(message)
				},
				updateLineItemQuantity(): Promise<any> {
					const message = getNotImplementedErrorMessage('cart.updateLineItemQuantity')
					console.error(message)
					throw new Error(message)
				},
				addProducts(products: Array<any>): Promise<any> {
					return handlers.cart.addProducts(products)
				},
				showMiniCart(): void {
					console.error(getNotImplementedErrorMessage('cart.showMiniCart'))
				},
				hideMiniCart(): void {
					console.error(getNotImplementedErrorMessage('cart.hideMiniCart'))
				},
				async getCurrentCart(): Promise<any> {
					console.error(getNotImplementedErrorMessage('cart.getCurrentCart'))
				},
				onChange() {
					console.error(getNotImplementedErrorMessage('cart.onChange'))
				},
				removeProduct(): Promise<any> {
					const message = getNotImplementedErrorMessage('cart.removeProduct')
					console.error(message)
					throw new Error(message)
				},
				addCustomItems(): Promise<any> {
					const message = getNotImplementedErrorMessage('cart.addCustomItems')
					console.error(message)
					throw new Error(message)
				},
				reload(): void {
					console.error(getNotImplementedErrorMessage('cart.reload'))
				},
			},
			navigate: {
				toCart(): Promise<void> {
					return handlers.navigate.toCart()
				},
				toProduct(productId: string): Promise<void> {
					return handlers.navigate.toProduct(productId)
				},
				toThankYouPage(): Promise<any> {
					const message = getNotImplementedErrorMessage('navigate.toThankYouPage')
					console.error(message)
					throw new Error(message)
				},
			},
		},
	}
}
