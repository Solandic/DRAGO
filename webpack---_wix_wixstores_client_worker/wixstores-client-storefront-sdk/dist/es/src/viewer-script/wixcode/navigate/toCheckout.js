import { CheckoutNavigationService } from '../../../services/CheckoutNavigationService/CheckoutNavigationService';
export var toCheckout = function (_a) {
    var context = _a.context, origin = _a.origin;
    return function (args) {
        var _a, _b;
        var params = {
            a11y: false,
            cartId: args.cartId,
            cashierPaymentId: args.paymentId,
            checkoutId: args.checkoutId,
            locale: context.siteStore.locale,
            deviceType: context.siteStore.isMobile() ? 'mobile' : 'desktop',
            isPickupOnly: false,
            isPreselectedFlow: (_a = args.isPreselectedFlow) !== null && _a !== void 0 ? _a : false,
            originType: (_b = args.originType) !== null && _b !== void 0 ? _b : 'unknown',
            paymentMethodName: args.paymentMethodName,
            siteBaseUrl: context.siteStore.location.baseUrl,
            continueShoppingUrl: args.continueShoppingUrl,
            disableContinueShopping: args.disableContinueShopping,
            successUrl: args.successUrl,
            theme: args.theme,
        };
        return new CheckoutNavigationService({ siteStore: context.siteStore, origin: origin }).navigateToCheckout(params);
    };
};
//# sourceMappingURL=toCheckout.js.map