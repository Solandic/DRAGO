import { __assign, __awaiter, __extends, __generator, __rest } from "tslib";
import { CommandsExecutor, AddToCartActionOption, PageMap, Topology, TrackEventName, CartEvents, } from '@wix/wixstores-client-core';
import * as _ from 'lodash';
import { CartApi } from '../../apis/CartApi/CartApi';
import { graphqlCartToCartSummary } from '../../apis/CartApi/graphqlCartToCartSummary';
import { removeUndefinedKeys } from '../../lib/removeUndefinedKeys';
import { getAdditionalFeesPrice, getCatalogAppIds, getItemsCount, getItemTypes, getNumberOfAdditionalFees, } from '../../utils/cart/bi.utils';
import { BaseActions } from '../BaseActions';
import { SideCartActions } from '../SideCartActions/SideCartActions';
var CartActions = /** @class */ (function (_super) {
    __extends(CartActions, _super);
    function CartActions(_a, performChange) {
        var siteStore = _a.siteStore, origin = _a.origin, _b = _a.originatedInWorker, originatedInWorker = _b === void 0 ? false : _b;
        var _this = _super.call(this, { siteStore: siteStore, origin: origin }) || this;
        _this.performChange = performChange;
        _this.commandsExecutor = new CommandsExecutor(Topology.CART_COMMANDS_URL, _this.siteStore.httpClient);
        _this.cartApi = new CartApi({ siteStore: siteStore, origin: origin, locale: siteStore.storeLanguage });
        _this.originatedInWorker = originatedInWorker;
        return _this;
    }
    CartActions.prototype.addToCart = function (_a, _b) {
        var productId = _a.productId, quantity = _a.quantity, _c = _a.addToCartAction, addToCartAction = _c === void 0 ? AddToCartActionOption.MINI_CART : _c, customTextFieldSelections = _a.customTextFieldSelections, optionsSelectionsIds = _a.optionsSelectionsIds, optionsSelectionsByNames = _a.optionsSelectionsByNames, _d = _a.onSuccess, onSuccess = _d === void 0 ? function () { return null; } : _d, subscriptionOptionId = _a.subscriptionOptionId, variantId = _a.variantId, preOrderRequested = _a.preOrderRequested;
        if (_b === void 0) { _b = {}; }
        var origin = _b.origin, reportData = __rest(_b, ["origin"]);
        return __awaiter(this, void 0, void 0, function () {
            var cartSummary;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.addToCartAndReturnCartSummary({
                            customTextFieldSelections: customTextFieldSelections,
                            optionsSelectionsByNames: optionsSelectionsByNames,
                            optionsSelectionsIds: optionsSelectionsIds,
                            productId: productId,
                            quantity: quantity,
                            subscriptionOptionId: subscriptionOptionId,
                            variantId: variantId,
                            preOrderRequested: preOrderRequested,
                        })];
                    case 1:
                        cartSummary = _e.sent();
                        if (!cartSummary.cartId) {
                            throw Error('error when adding to cart');
                        }
                        this.reportAddToCart(__assign({ productId: productId, hasOptions: Object.keys(optionsSelectionsByNames !== null && optionsSelectionsByNames !== void 0 ? optionsSelectionsByNames : {}).length > 0, cartId: _.get(cartSummary, 'cartId', undefined), quantity: quantity, origin: origin !== null && origin !== void 0 ? origin : this.origin, variantId: variantId }, reportData));
                        return [2 /*return*/, this.onAddToCartCompleted(cartSummary, addToCartAction, productId, onSuccess)];
                }
            });
        });
    };
    // eslint-disable-next-line @typescript-eslint/tslint/config
    CartActions.prototype.addToCartAndReturnCartSummary = function (_a) {
        var customTextFieldSelections = _a.customTextFieldSelections, optionsSelectionsByNames = _a.optionsSelectionsByNames, optionsSelectionsIds = _a.optionsSelectionsIds, productId = _a.productId, quantity = _a.quantity, subscriptionOptionId = _a.subscriptionOptionId, variantId = _a.variantId, preOrderRequested = _a.preOrderRequested;
        return __awaiter(this, void 0, void 0, function () {
            var cart;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.cartApi.addToCart([
                            {
                                productId: productId,
                                quantity: quantity,
                                variantId: variantId,
                                optionsSelectionsIds: optionsSelectionsIds,
                                optionsSelectionsByNames: optionsSelectionsByNames,
                                subscriptionOptionId: subscriptionOptionId,
                                customTextFieldSelections: customTextFieldSelections,
                                preOrderRequested: preOrderRequested,
                            },
                        ])];
                    case 1:
                        cart = _b.sent();
                        return [2 /*return*/, graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    /** @deprecated this is no longer relevant externally due to new side cart */
    CartActions.prototype.shouldNavigateToCart = function () {
        return !this.siteStore.isMiniCartExists;
    };
    /*istanbul ignore next: todo: test */
    CartActions.prototype.onAddToCartCompleted = function (cartSummary, addToCartAction, productId, onSuccess) {
        if (addToCartAction === void 0) { addToCartAction = AddToCartActionOption.MINI_CART; }
        return __awaiter(this, void 0, void 0, function () {
            var shouldOpenCart, sideCartActions, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (addToCartAction === AddToCartActionOption.NONE && !this.siteStore.isCartIconExists) {
                            addToCartAction = AddToCartActionOption.MINI_CART;
                        }
                        shouldOpenCart = addToCartAction === AddToCartActionOption.TINY_CART;
                        this.publishCart(cartSummary, 'AddToCartCompleted', {
                            shouldOpenCart: shouldOpenCart,
                            addToCartActionOption: addToCartAction,
                            addedProductId: productId,
                        });
                        onSuccess();
                        sideCartActions = new SideCartActions({ siteStore: this.siteStore, origin: 'addToCartPublicAPI' });
                        if (!(addToCartAction === AddToCartActionOption.MINI_CART)) return [3 /*break*/, 4];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sideCartActions.showMiniCartOrSideCart()];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _d.sent();
                        return [2 /*return*/, this.navigateToCart(this.origin)];
                    case 4:
                        _b = addToCartAction === AddToCartActionOption.CART ||
                            (addToCartAction === AddToCartActionOption.TINY_CART && this.shouldNavigateToCart());
                        if (_b) return [3 /*break*/, 7];
                        _c = addToCartAction === AddToCartActionOption.MINI_CART &&
                            this.shouldNavigateToCart();
                        if (!_c) return [3 /*break*/, 6];
                        return [4 /*yield*/, sideCartActions.hasSideCart()];
                    case 5:
                        _c = !(_d.sent());
                        _d.label = 6;
                    case 6:
                        _b = (_c);
                        _d.label = 7;
                    case 7:
                        if (_b) {
                            return [2 /*return*/, this.navigateToCart(this.origin)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CartActions.prototype.mergeAddToCartItemsProductId = function (items) {
        return items.reduce(function (acc, item) {
            var _a;
            acc.push({
                productId: (_a = item.productId) !== null && _a !== void 0 ? _a : item.productID,
                options: item.options,
                quantity: item.quantity,
                preOrderRequested: item.preOrderRequested,
            });
            return acc;
        }, []);
    };
    CartActions.prototype.publishCart = function (cartSummary, reason, eventOptions) {
        if (eventOptions === void 0) { eventOptions = {
            shouldOpenCart: false,
            addToCartActionOption: AddToCartActionOption.MINI_CART,
        }; }
        var _a = cartSummary, _billingAddress = _a.billingAddress, _shippingAddress = _a.shippingAddress, publishableCart = __rest(_a, ["billingAddress", "shippingAddress"]);
        if (this.performChange) {
            this.performChange(cartSummary);
        }
        this.siteStore.pubSubManager.publish(CartEvents.CHANGED, __assign(__assign({}, publishableCart), { extraParams: { origin: this.origin }, eventOptions: __assign(__assign({}, eventOptions), { originatedInWorker: this.originatedInWorker }), reason: reason }));
    };
    CartActions.prototype.navigateToCart = function (origin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.siteStore.navigate({
                        sectionId: PageMap.CART,
                        queryParams: { origin: origin },
                    }, true)];
            });
        });
    };
    CartActions.prototype.removeItemFromCart = function (_a, options) {
        var _b;
        var cartId = _a.cartId, cartItemId = _a.cartItemId, productId = _a.productId, productType = _a.productType, productName = _a.productName, price = _a.price, sku = _a.sku, quantity = _a.quantity, currency = _a.currency;
        if (options === void 0) { options = { silent: false }; }
        return __awaiter(this, void 0, void 0, function () {
            var cartSummary;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.cartApi.removeItem({ cartId: cartId, cartItemId: cartItemId })];
                    case 1:
                        cartSummary = _c.sent();
                        if (!options.silent) {
                            this.publishCart(cartSummary, 'removeItemFromCart', { shouldOpenCart: false });
                        }
                        void this.siteStore.platformBiLogger.removedProductFromCartSf({
                            cartId: cartId,
                            productId: productId,
                            productType: productType,
                            origin: (_b = options.origin) !== null && _b !== void 0 ? _b : this.origin,
                            additionalFeesPrice: getAdditionalFeesPrice(cartSummary),
                            numberOfAdditionalFees: getNumberOfAdditionalFees(cartSummary),
                            itemsCount: getItemsCount(cartSummary),
                            catalogAppId: getCatalogAppIds(cartSummary),
                            checkoutId: cartSummary.checkoutId,
                            purchaseFlowId: cartSummary.purchaseFlowId,
                        });
                        this.siteStore.trackEvent(TrackEventName.REMOVE_FROM_CART, {
                            id: productId,
                            name: productName,
                            price: price,
                            quantity: quantity,
                            sku: sku,
                            currency: currency,
                            type: productType,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @deprecated. use EDM instead
     */
    CartActions.prototype.addCustomItemsToCart = function (customItems) {
        return __awaiter(this, void 0, void 0, function () {
            var customAmounts, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customAmounts = customItems.map(function (item) {
                            return {
                                name: item.name,
                                notes: item.note,
                                quantity: item.quantity,
                                amount: item.price,
                            };
                        });
                        return [4 /*yield*/, this.commandsExecutor.execute('BulkAddDetailedCustomAmountV2', {
                                amounts: customAmounts,
                            })];
                    case 1:
                        response = _a.sent();
                        this.publishCart(response.data.cartSummary, 'addCustomItemsToCart', { shouldOpenCart: false });
                        return [2 /*return*/];
                }
            });
        });
    };
    CartActions.prototype.applyCouponToCart = function (_a, options) {
        var _b;
        var cartId = _a.cartId, couponCode = _a.couponCode, userIdentifier = _a.userIdentifier, isMember = _a.isMember;
        return __awaiter(this, void 0, void 0, function () {
            var cartSummary;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.cartApi.applyCoupon(cartId, couponCode, userIdentifier)];
                    case 1:
                        cartSummary = _c.sent();
                        this.publishCart(cartSummary, 'applyCouponToCart');
                        void this.siteStore.platformBiLogger.clickApplyCoupon({
                            origin: (_b = options === null || options === void 0 ? void 0 : options.origin) !== null && _b !== void 0 ? _b : this.origin,
                            cartId: cartId,
                            couponCode: couponCode,
                            isMember: isMember,
                            additionalFeesPrice: getAdditionalFeesPrice(cartSummary),
                            numberOfAdditionalFees: getNumberOfAdditionalFees(cartSummary),
                            catalogAppId: getCatalogAppIds(cartSummary),
                            checkoutId: cartSummary.checkoutId,
                            itemType: getItemTypes(cartSummary),
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CartActions.prototype.removeCouponFromCart = function (_a, options) {
        var _b;
        var cartId = _a.cartId, couponId = _a.couponId, couponCode = _a.couponCode;
        return __awaiter(this, void 0, void 0, function () {
            var cartSummary;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.cartApi.removeCoupon({ cartId: cartId, couponId: couponId })];
                    case 1:
                        cartSummary = _c.sent();
                        this.publishCart(cartSummary, 'removeCouponFromCart');
                        void this.siteStore.platformBiLogger.removeACoupon({
                            origin: (_b = options === null || options === void 0 ? void 0 : options.origin) !== null && _b !== void 0 ? _b : this.origin,
                            cartId: cartId,
                            couponId: couponId,
                            couponCode: couponCode,
                            additionalFeesPrice: getAdditionalFeesPrice(cartSummary),
                            numberOfAdditionalFees: getNumberOfAdditionalFees(cartSummary),
                            catalogAppId: getCatalogAppIds(cartSummary),
                            checkoutId: cartSummary.checkoutId,
                            itemType: getItemTypes(cartSummary),
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CartActions.prototype.updateLineItemQuantityInCart = function (_a, options) {
        var _b;
        var cartId = _a.cartId, cartItemId = _a.cartItemId, quantity = _a.quantity, productId = _a.productId, cartType = _a.cartType;
        if (options === void 0) { options = { silent: false }; }
        return __awaiter(this, void 0, void 0, function () {
            var cartSummary;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.cartApi.updateItemQuantity({ cartId: cartId, cartItemId: cartItemId, quantity: quantity })];
                    case 1:
                        cartSummary = _c.sent();
                        if (!options.silent) {
                            this.publishCart(cartSummary, 'updateLineItemQuantityInCart');
                        }
                        void this.siteStore.platformBiLogger.updatedCartItemQuantitySf({
                            origin: (_b = options.origin) !== null && _b !== void 0 ? _b : this.origin,
                            productId: productId,
                            itemsCount: getItemsCount(cartSummary),
                            cartId: cartId,
                            cartType: cartType,
                            additionalFeesPrice: getAdditionalFeesPrice(cartSummary),
                            numberOfAdditionalFees: getNumberOfAdditionalFees(cartSummary),
                            catalogAppId: getCatalogAppIds(cartSummary),
                            checkoutId: cartSummary.checkoutId,
                            purchaseFlowId: cartSummary.purchaseFlowId,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CartActions.prototype.addProductToCartMutation = function (products) {
        return __awaiter(this, void 0, void 0, function () {
            var mappedProducts, graphqlCartResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mappedProducts = products.map(function (_a) {
                            var productId = _a.productId, quantity = _a.quantity, preOrderRequested = _a.preOrderRequested, _b = _a.options, options = _b === void 0 ? {} : _b;
                            return (__assign(__assign(__assign({ productId: productId, quantity: quantity }, (options.choices && { optionsSelectionsByNames: options.choices })), (options.customTextFields && { customTextFieldSelections: options.customTextFields })), (preOrderRequested ? { preOrderRequested: preOrderRequested } : {})));
                        });
                        return [4 /*yield*/, this.cartApi.addToCart(mappedProducts)];
                    case 1:
                        graphqlCartResponse = _a.sent();
                        return [2 /*return*/, graphqlCartToCartSummary(graphqlCartResponse)];
                }
            });
        });
    };
    CartActions.prototype.addProductsToCart = function (products, options) {
        if (options === void 0) { options = { silent: false }; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        products = this.mergeAddToCartItemsProductId(products);
                        return [4 /*yield*/, this.addProductToCartMutation(products)];
                    case 1:
                        data = _a.sent();
                        products.forEach(function (item) {
                            var _a;
                            _this.reportAddToCart({
                                productId: item.productId,
                                hasOptions: !!_.get(item, 'options.choices[0]', false),
                                quantity: item.quantity,
                                cartId: data.cartId,
                                origin: (_a = options.origin) !== null && _a !== void 0 ? _a : _this.origin,
                            });
                        });
                        if (!options.silent) {
                            this.publishCart(data, 'addProductsToCart', { shouldOpenCart: false });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CartActions.prototype.reportAddToCart = function (_a) {
        var cartId = _a.cartId, _b = _a.category, category = _b === void 0 ? 'All Products' : _b, hasOptions = _a.hasOptions, name = _a.name, origin = _a.origin, variantId = _a.variantId, price = _a.price, productId = _a.productId, quantity = _a.quantity, sku = _a.sku, type = _a.type, buttonType = _a.buttonType, appName = _a.appName, productType = _a.productType, isNavigateCart = _a.isNavigateCart, navigationClick = _a.navigationClick, impressionId = _a.impressionId, galleryProductsLogic = _a.galleryProductsLogic, rank = _a.rank, galleryInputId = _a.galleryInputId;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.clickOnAddToCartSf(removeUndefinedKeys({
            appName: appName,
            buttonType: buttonType,
            hasOptions: hasOptions,
            isNavigateCart: isNavigateCart,
            navigationClick: navigationClick,
            origin: origin,
            productId: productId,
            productType: productType,
            quantity: quantity,
            impressionId: impressionId,
            galleryProductsLogic: galleryProductsLogic,
            rank: rank,
            galleryInputId: galleryInputId,
        }));
        this.siteStore.trackEvent(TrackEventName.ADD_TO_CART, removeUndefinedKeys({
            cartId: cartId,
            currency: this.siteStore.currency,
            id: productId,
            quantity: quantity,
            name: name,
            sku: sku,
            price: price,
            type: type,
            category: category,
            variantId: variantId,
        }));
    };
    CartActions.prototype.getCurrentCart = function (options) {
        return this.cartApi.fetchCart(options);
    };
    CartActions.prototype.setDestinationForEstimation = function (data, cartId) {
        return __awaiter(this, void 0, void 0, function () {
            var cartSummary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cartApi.setDestinationForEstimation(data, cartId)];
                    case 1:
                        cartSummary = _a.sent();
                        this.publishCart(cartSummary, 'setDestinationForEstimation', { shouldOpenCart: false });
                        return [2 /*return*/];
                }
            });
        });
    };
    CartActions.prototype.setShippingOption = function (cartId, selectedShippingOption) {
        return __awaiter(this, void 0, void 0, function () {
            var cartSummary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cartApi.setShippingOption(cartId, selectedShippingOption)];
                    case 1:
                        cartSummary = _a.sent();
                        this.publishCart(cartSummary, 'setShippingOption', { shouldOpenCart: false });
                        return [2 /*return*/];
                }
            });
        });
    };
    CartActions.prototype.updateBuyerNote = function (cartId, buyerNote) {
        return __awaiter(this, void 0, void 0, function () {
            var cartSummary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cartApi.updateBuyerNoteMutation(cartId, buyerNote)];
                    case 1:
                        cartSummary = _a.sent();
                        this.publishCart(cartSummary, 'updateBuyerNote', { shouldOpenCart: false });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @deprecated. use currentCartService.refresh instead
     */
    CartActions.prototype.reloadCart = function () {
        var _this = this;
        return this.cartApi
            .fetchCart()
            .then(function (cart) { return graphqlCartToCartSummary(cart); })
            .then(function (cartSummary) { return _this.publishCart(cartSummary, 'reloadCart', { shouldOpenCart: false }); });
    };
    return CartActions;
}(BaseActions));
export { CartActions };
//# sourceMappingURL=CartActions.js.map