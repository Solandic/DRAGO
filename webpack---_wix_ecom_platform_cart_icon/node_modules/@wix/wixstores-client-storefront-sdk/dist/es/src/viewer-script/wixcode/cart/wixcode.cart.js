import { __assign, __awaiter, __generator } from "tslib";
import { CartEvents } from '@wix/wixstores-client-core';
import { MinicartActions } from '../../../actions/MiniCartActions/MinicartActions';
import { CartApi } from '../../../apis/CartApi/CartApi';
import { TinyCartActions } from '../../../actions/TinyCartActions/TinyCartActions';
import { SideCartActions } from '../../../actions/SideCartActions/SideCartActions';
import { SPECS } from '../../../constants';
import { intToGuid } from '../../../utils/intToGuid';
export function createCartExports(_a) {
    var _this = this;
    var context = _a.context, origin = _a.origin;
    var getCurrentCartByContext = function (_a) {
        var siteStore = _a.siteStore;
        return new CartApi({ siteStore: siteStore, origin: origin }).fetchCart();
    };
    var getMiniCartActions = function (siteStore) { return new MinicartActions({ siteStore: siteStore, origin: origin }); };
    var getSideCartActions = function (siteStore) { return new SideCartActions({ siteStore: siteStore, origin: origin }); };
    var getTinyCartActions = function (siteStore) { return new TinyCartActions({ siteStore: siteStore, origin: origin }); };
    var hideMiniCart = function () {
        if (context.siteStore.isMobile()) {
            throw Error("can't handle mini cart in mobile");
        }
        getMiniCartActions(context.siteStore).hideMinicart();
    };
    return {
        getCurrentCart: function () {
            if (context.siteStore.experiments.enabled(SPECS.GetCurrentCartFromCacheInVelo)) {
                return context.currentCartService.getCurrentCartGQL();
            }
            return context.currentCartService.cartActions.getCurrentCart();
        },
        onChange: function (listener) {
            if (context.siteStore.experiments.enabled(SPECS.GetCurrentCartFromCacheInVelo)) {
                return context.currentCartService.onChange(listener);
            }
            else {
                context.siteStore.pubSubManager.subscribe(CartEvents.CHANGED, listener);
            }
        },
        removeProduct: function (cartItemId, options) {
            if (options === void 0) { options = { silent: false }; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (context.siteStore.experiments.enabled(SPECS.GetCurrentCartFromCacheInVelo)) {
                        return [2 /*return*/, context.currentCartService.removeLineItem({ lineItemId: intToGuid(Number(cartItemId)) }, { origin: origin })];
                    }
                    return [2 /*return*/, getCurrentCartByContext(context).then(function (_a) {
                            var cartId = _a.cartId;
                            return context.currentCartService.cartActions.removeItemFromCart({ cartId: cartId, cartItemId: Number(cartItemId) }, __assign({ origin: origin }, options));
                        })];
                });
            });
        },
        /**
         * @deprecated. use EDM instead
         */
        addCustomItems: function (customItems) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, context.currentCartService.cartActions.addCustomItemsToCart(customItems)];
            });
        }); },
        /**
         * @deprecated. use EDM instead
         */
        addProducts: function (items, options) {
            if (options === void 0) { options = { silent: false }; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, context.currentCartService.cartActions.addProductsToCart(items, __assign({ origin: origin }, options))];
                });
            });
        },
        /**
         * @deprecated. use EDM instead
         */
        addToCart: function (productId, quantity, options, preOrderRequested, trackData) {
            if (options === void 0) { options = {}; }
            if (preOrderRequested === void 0) { preOrderRequested = undefined; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, context.currentCartService.cartActions.addToCart({
                                productId: "".concat(productId),
                                quantity: parseInt("".concat(quantity), 10),
                                optionsSelectionsByNames: options.choices,
                                customTextFieldSelections: options.customTextFields,
                                optionsSelectionsIds: options.optionsSelectionsIds,
                                variantId: options.variantId,
                                subscriptionOptionId: options.subscriptionOptionId,
                                addToCartAction: options.addToCartAction,
                                preOrderRequested: preOrderRequested,
                            }, __assign(__assign({}, trackData), { origin: origin }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        applyCoupon: function (couponCode) {
            if (context.siteStore.experiments.enabled(SPECS.GetCurrentCartFromCacheInVelo)) {
                return context.currentCartService.applyCoupon({ code: couponCode }, { origin: origin });
            }
            return getCurrentCartByContext(context).then(function (_a) {
                var cartId = _a.cartId;
                return context.currentCartService.cartActions.applyCouponToCart({ cartId: cartId, couponCode: couponCode }, { origin: origin });
            });
        },
        removeCoupon: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (context.siteStore.experiments.enabled(SPECS.GetCurrentCartFromCacheInVelo)) {
                    return [2 /*return*/, context.currentCartService.removeCoupon({ origin: origin })];
                }
                return [2 /*return*/, getCurrentCartByContext(context).then(function (_a) {
                        var cartId = _a.cartId, appliedCoupon = _a.appliedCoupon;
                        return context.currentCartService.cartActions.removeCouponFromCart({
                            cartId: cartId,
                            couponCode: appliedCoupon.code,
                            couponId: appliedCoupon.couponId,
                        }, { origin: origin });
                    })];
            });
        }); },
        updateLineItemQuantity: function (cartItemId, quantity, options) {
            if (options === void 0) { options = { silent: false }; }
            if (context.siteStore.experiments.enabled(SPECS.GetCurrentCartFromCacheInVelo)) {
                return context.currentCartService.updateLineItemQuantity({ lineItemId: intToGuid(cartItemId), quantity: quantity }, { origin: origin });
            }
            return getCurrentCartByContext(context).then(function (_a) {
                var cartId = _a.cartId;
                return context.currentCartService.cartActions.updateLineItemQuantityInCart({ cartId: cartId, cartItemId: cartItemId, quantity: quantity }, __assign({ origin: origin }, options));
            });
        },
        showMinicart: function () { return getSideCartActions(context.siteStore).showMiniCartOrSideCart(); },
        hideMinicart: hideMiniCart,
        openSideCart: function () { return getSideCartActions(context.siteStore).showMiniCartOrSideCart(); },
        showTinycart: function () {
            if (context.siteStore.isMobile()) {
                throw Error("can't open success popup in mobile");
            }
            getTinyCartActions(context.siteStore).showTinyCart();
        },
        hideTinycart: function () {
            if (context.siteStore.isMobile()) {
                throw Error("can't open success popup in mobile");
            }
            getTinyCartActions(context.siteStore).hideTinyCart();
        },
        reloadCart: function () {
            if (context.siteStore.experiments.enabled(SPECS.GetCurrentCartFromCacheInVelo)) {
                return context.currentCartService.refresh();
            }
            context.siteStore.pubSubManager.publish(CartEvents.INVALIDATED, {});
            return context.currentCartService.cartActions.reloadCart();
        },
        hasSideCart: function () { return getSideCartActions(context.siteStore).hasSideCart(); },
    };
}
//# sourceMappingURL=wixcode.cart.js.map