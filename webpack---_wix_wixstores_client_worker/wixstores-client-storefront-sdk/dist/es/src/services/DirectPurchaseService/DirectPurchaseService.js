import { __awaiter, __generator } from "tslib";
import { CheckoutNavigationService } from '../CheckoutNavigationService/CheckoutNavigationService';
import { CartApi } from '../../apis/CartApi/CartApi';
import { StoreMetaDataApi } from '../../apis/StoreMetaDataApi/StoreMetaDataApi';
import { ProductType } from '@wix/wixstores-client-core';
var DirectPurchaseService = /** @class */ (function () {
    function DirectPurchaseService(_a) {
        var siteStore = _a.siteStore, origin = _a.origin;
        this.isValidVolatileCart = function (cart) {
            //new cart response is not returning lineItems - https://jira.wixpress.com/browse/EE-40720
            //for now, change to check for checkoutId
            //return cart.lineItems !== null && cart.lineItems.length > 0;
            return !!cart.checkoutId;
        };
        this.siteStore = siteStore;
        this.origin = origin;
        this.checkoutNavigationService = new CheckoutNavigationService({ siteStore: this.siteStore, origin: this.origin });
        this.storeMetaDataApi = new StoreMetaDataApi({ siteStore: this.siteStore, origin: this.origin });
        this.cartApi = new CartApi({ siteStore: siteStore, origin: origin });
    }
    DirectPurchaseService.prototype.getStoreMetaData = function () {
        return this.storeMetaDataApi.getStoreMetaData();
    };
    DirectPurchaseService.prototype.handleDirectPurchase = function (_a) {
        var productId = _a.productId, _b = _a.withNavigateToCheckout, withNavigateToCheckout = _b === void 0 ? true : _b, _c = _a.preOrderRequested, preOrderRequested = _c === void 0 ? false : _c, 
        /* istanbul ignore next */ _d = _a.productType, 
        /* istanbul ignore next */ productType = _d === void 0 ? ProductType.UNRECOGNISED : _d, 
        /* istanbul ignore next */ _e = _a.quantity, 
        /* istanbul ignore next */ quantity = _e === void 0 ? 1 : _e, 
        /* istanbul ignore next */ _f = _a.customTextFieldSelection, 
        /* istanbul ignore next */ customTextFieldSelection = _f === void 0 ? [] : _f, 
        /* istanbul ignore next */ _g = _a.optionSelectionId, 
        /* istanbul ignore next */ optionSelectionId = _g === void 0 ? [] : _g, 
        /* istanbul ignore next */ _h = _a.locale, 
        /* istanbul ignore next */ locale = _h === void 0 ? 'en' : _h, 
        /* istanbul ignore next */ _j = _a.a11y, 
        /* istanbul ignore next */ a11y = _j === void 0 ? false : _j, 
        /* istanbul ignore next */ _k = _a.buyerNote, 
        /* istanbul ignore next */ buyerNote = _k === void 0 ? '' : _k, 
        /* istanbul ignore next */ _l = _a.deviceType, 
        /* istanbul ignore next */ deviceType = _l === void 0 ? 'desktop' : _l, 
        /* istanbul ignore next */ _m = _a.isPickupOnly, 
        /* istanbul ignore next */ isPickupOnly = _m === void 0 ? false : _m, 
        /* istanbul ignore next */ _o = _a.originType, 
        /* istanbul ignore next */ originType = _o === void 0 ? 'unknown' : _o, 
        /* istanbul ignore next */ _p = _a.siteBaseUrl, 
        /* istanbul ignore next */ siteBaseUrl = _p === void 0 ? '' : _p, 
        /* istanbul ignore next */ _q = _a.subscriptionOptionId, 
        /* istanbul ignore next */ subscriptionOptionId = _q === void 0 ? null : _q, 
        /* istanbul ignore next */ _r = _a.variantId, 
        /* istanbul ignore next */ variantId = _r === void 0 ? null : _r, 
        /* istanbul ignore next */ _s = _a.options, 
        /* istanbul ignore next */ options = _s === void 0 ? null : _s;
        return __awaiter(this, void 0, void 0, function () {
            var _t, isPremium, canStoreShip, hasCreatedPaymentMethods, isPickupOnlySettings, _u, canCheckout, modalType, volatileCart;
            return __generator(this, function (_v) {
                switch (_v.label) {
                    case 0: return [4 /*yield*/, this.getStoreMetaData()];
                    case 1:
                        _t = _v.sent(), isPremium = _t.isPremium, canStoreShip = _t.canStoreShip, hasCreatedPaymentMethods = _t.hasCreatedPaymentMethods, isPickupOnlySettings = _t.isPickupOnly;
                        _u = this.checkoutNavigationService.checkIsAllowedToCheckout({
                            areAllItemsDigital: productType === ProductType.DIGITAL,
                            isPremium: Boolean(isPremium),
                            canStoreShip: canStoreShip,
                            hasCreatedPaymentMethods: hasCreatedPaymentMethods,
                            isSubscribe: false,
                            canShipToDestination: true,
                            hasShippableItems: productType === ProductType.PHYSICAL,
                        }), canCheckout = _u.canCheckout, modalType = _u.modalType;
                        if (!canCheckout) {
                            void this.checkoutNavigationService.openModalByType(modalType, true);
                            throw Error("this store is not eligible for checkout (".concat(modalType, ")"));
                        }
                        return [4 /*yield*/, this.cartApi.createVolatileCart({
                                productId: productId,
                                optionSelectionId: optionSelectionId,
                                customTextFieldSelection: customTextFieldSelection,
                                quantity: quantity,
                                buyerNote: buyerNote,
                                subscriptionOptionId: subscriptionOptionId,
                                variantId: variantId,
                                isPickupOnly: isPickupOnly || !!isPickupOnlySettings,
                                options: options,
                                preOrderRequested: preOrderRequested,
                            })];
                    case 2:
                        volatileCart = _v.sent();
                        if (!this.isValidVolatileCart(volatileCart)) {
                            throw Error('cannot checkout an empty cart');
                        }
                        if (!withNavigateToCheckout) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.checkoutNavigationService.navigateToCheckout({
                                checkoutId: volatileCart.checkoutId,
                                cartId: volatileCart.id,
                                a11y: a11y,
                                isPickupOnly: isPickupOnly,
                                deviceType: deviceType,
                                originType: originType,
                                locale: locale,
                                siteBaseUrl: siteBaseUrl,
                            })];
                    case 3:
                        _v.sent();
                        _v.label = 4;
                    case 4: return [2 /*return*/, { cartId: volatileCart.id, checkoutId: volatileCart.checkoutId }];
                }
            });
        });
    };
    return DirectPurchaseService;
}());
export { DirectPurchaseService };
//# sourceMappingURL=DirectPurchaseService.js.map