import { createFedopsLogger } from '@wix/thunderbolt-commons'
import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace } from '../symbols'
import type {
	WixEcomFrontendWixCodeSdkHandlers,
	WixEcomFrontendWixCodeSdkWixCodeApi,
	WixEcomFrontendWixCodeSdkSiteConfig,
} from '../types'
import { MethodNames } from '../types'
import { WixEcomFrontendServiceSdk } from './WixEcomFrontendServiceSdk'
import { createBiLogger } from './bi'

export function WixEcomFrontendSdkFactory({
	featureConfig,
	handlers,
	platformUtils,
	platformEnvData,
}: WixCodeApiFactoryArgs<WixEcomFrontendWixCodeSdkSiteConfig, unknown, WixEcomFrontendWixCodeSdkHandlers>): {
	[namespace]: WixEcomFrontendWixCodeSdkWixCodeApi
} {
	const { biUtils, appsPublicApisUtils, essentials } = platformUtils
	const { bi, site, location } = platformEnvData
	const shouldLogBi = Boolean(site.experiments['specs.thunderbolt.UseEcomFemBi'])
	const biLoggerFactory = biUtils.createBiLoggerFactoryForFedops()
	const fedopsLogger = createFedopsLogger({
		biLoggerFactory,
		appName: 'ecom-wix-code-sdk',
		factory: essentials.createFedopsLogger,
		experiments: essentials.experiments.all(),
		monitoringData: {
			metaSiteId: platformEnvData.location.metaSiteId,
			dc: bi.dc,
			isHeadless: bi.isjp, // name is weird because legacy
			isCached: bi.isCached,
			rolloutData: bi.rolloutData,
			viewerSessionId: bi.viewerSessionId,
		},
	})

	const biLogger = shouldLogBi
		? createBiLogger({
				biUtils,
				msid: location.metaSiteId,
		  })
		: undefined

	const wixEcomFrontendServiceSdk = new WixEcomFrontendServiceSdk(appsPublicApisUtils, fedopsLogger)

	return {
		[namespace]: {
			someKey: featureConfig.someKey,
			doSomething: handlers.doSomething,
			refreshCart(): Promise<void> {
				biLogger?.logFemCall(MethodNames.refreshCart)
				return wixEcomFrontendServiceSdk.refreshCart()
			},
			onCartChange(handler: () => void) {
				biLogger?.logFemCall(MethodNames.onCartChange)
				wixEcomFrontendServiceSdk.onCartChange(handler)
			},
			openSideCart(): void {
				biLogger?.logFemCall(MethodNames.openSideCart)
				wixEcomFrontendServiceSdk.openSideCart()
			},
			navigateToCartPage(): Promise<void> {
				biLogger?.logFemCall(MethodNames.navigateToCartPage)
				return wixEcomFrontendServiceSdk.navigateToCartPage()
			},
			navigateToCheckoutPage(
				checkoutId: string,
				options?: {
					skipDeliveryStep?: boolean
					hideContinueBrowsingButton?: boolean
					overrideContinueBrowsingUrl?: string
					overrideThankYouPageUrl?: string
				}
			): Promise<void> {
				biLogger?.logFemCall(MethodNames.navigateToCheckoutPage, JSON.stringify({ checkoutId, ...options }))
				return wixEcomFrontendServiceSdk.navigateToCheckoutPage(checkoutId, options)
			},
		},
	}
}
