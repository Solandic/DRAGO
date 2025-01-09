import { __assign, __awaiter, __extends, __generator, __read, __spreadArray } from "tslib";
import { CartActions } from '../../actions/CartActions/CartActions';
import { APP_DEFINITION_ID, MULTI_LANG_HEADER_NAME, CURRENCY_HEADER_NAME } from '@wix/wixstores-client-core';
import { DEFAULT_CART_OPTIONS, MiniCartEvents, SideCartEvents, SPECS } from '../../constants';
import { guidToInt } from '../../utils/guidToInt';
import { createClient } from '@wix/sdk/client';
import { currentCart } from '@wix/ecom';
var CACHE_KEY = 'CURRENT_CART';
var origin = 'current-cart-service';
var BaseCurrentCartService = /** @class */ (function () {
    function BaseCurrentCartService(_a) {
        var context = _a.context, apis = _a.apis;
        this.callbacks = [];
        this.apis = apis;
        this.siteStore = context.siteStore;
    }
    BaseCurrentCartService.prototype.onChange = function (callback) {
        this.callbacks.push(callback);
    };
    BaseCurrentCartService.prototype.runCallbacks = function () {
        this.callbacks.forEach(function (callback) { return callback(); });
    };
    return BaseCurrentCartService;
}());
export { BaseCurrentCartService };
var CurrentCartService = /** @class */ (function (_super) {
    __extends(CurrentCartService, _super);
    function CurrentCartService(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = function (cart) {
            _this.cartPromise = Promise.resolve(cart);
            _this.saveCartToCache(cart);
        };
        _this.cartActions = new CartActions({ siteStore: _this.siteStore, origin: origin, originatedInWorker: true }, _this.handleChange);
        _this.initParams = props.initParams;
        _this.useSdk = _this.siteStore.experiments.enabled(SPECS.UseSDKInCurrentCartService);
        if (_this.useSdk) {
            var currencyHeader_1 = _this.siteStore.getCurrencyHeader();
            var multiLangHeader_1 = _this.siteStore.getMultiLangHeader();
            var wixClient = createClient({
                auth: {
                    getAuthHeaders: function () {
                        var _a, _b;
                        return ({
                            headers: __assign(__assign({ Authorization: _this.initParams.instance }, (currencyHeader_1 ? (_a = {}, _a[CURRENCY_HEADER_NAME] = _this.siteStore.getCurrencyHeader(), _a) : {})), (multiLangHeader_1 ? (_b = {}, _b[MULTI_LANG_HEADER_NAME] = _this.siteStore.getMultiLangHeader(), _b) : {})),
                        });
                    },
                },
                modules: {
                    currentCart: {
                        getCurrentCart: currentCart.getCurrentCart,
                        estimateCurrentCartTotals: currentCart.estimateCurrentCartTotals,
                    },
                },
            });
            _this.currentCartApi = wixClient.currentCart;
        }
        return _this;
    }
    CurrentCartService.prototype.init = function () {
        this.cartPromise = this.getCurrentCartFromCacheOrServer();
        this.listenToCurrentCartEvents();
        this.listenToSideCartRequests();
    };
    CurrentCartService.prototype.notifyChange = function () {
        this.runCallbacks();
        this.publishCurrentCartUpdated();
    };
    CurrentCartService.prototype.getCurrentCart = function () {
        /*istanbul ignore next */
        if (!this.currentCartApi) {
            throw new Error('Only supported with sdk');
        }
        return this.currentCartApi.getCurrentCart();
    };
    CurrentCartService.prototype.estimateCurrentCartTotals = function (options) {
        /*istanbul ignore next */
        if (!this.currentCartApi) {
            throw new Error('Only supported with sdk');
        }
        return this.currentCartApi.estimateCurrentCartTotals(options);
    };
    CurrentCartService.prototype.getCurrentCartGQL = function (options) {
        if (options === void 0) { options = DEFAULT_CART_OPTIONS; }
        var withShipping = options.withShipping, withTax = options.withTax, shouldSyncWithCurrentCart = options.shouldSyncWithCurrentCart;
        if (withShipping !== DEFAULT_CART_OPTIONS.withShipping || withTax !== DEFAULT_CART_OPTIONS.withTax) {
            if (shouldSyncWithCurrentCart) {
                void this.refresh();
            }
            return this.cartActions.getCurrentCart({ withShipping: withShipping, withTax: withTax, locale: this.siteStore.storeLanguage });
        }
        if (!this.cartPromise) {
            this.cartPromise = this.getCurrentCartFromCacheOrServer();
        }
        return this.cartPromise;
    };
    CurrentCartService.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.invalidateCurrentCartCache();
                        this.cartPromise = this.getCurrentCartFromServerAndSaveToCache();
                        this.notifyChange();
                        return [4 /*yield*/, this.cartPromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CurrentCartService.prototype.updateLineItemQuantity = function (_a, biProps) {
        var lineItemId = _a.lineItemId, quantity = _a.quantity;
        return __awaiter(this, void 0, void 0, function () {
            var cartId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCurrentCartGQL()];
                    case 1:
                        cartId = (_b.sent()).cartId;
                        return [2 /*return*/, this.cartActions.updateLineItemQuantityInCart({
                                cartId: cartId,
                                cartItemId: guidToInt(lineItemId),
                                quantity: quantity,
                            }, biProps)];
                }
            });
        });
    };
    CurrentCartService.prototype.removeLineItem = function (_a, biProps) {
        var lineItemId = _a.lineItemId;
        return __awaiter(this, void 0, void 0, function () {
            var cartId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCurrentCartGQL()];
                    case 1:
                        cartId = (_b.sent()).cartId;
                        return [2 /*return*/, this.cartActions.removeItemFromCart({ cartId: cartId, cartItemId: guidToInt(lineItemId) }, biProps)];
                }
            });
        });
    };
    CurrentCartService.prototype.updateBuyerNote = function (_a) {
        var buyerNote = _a.buyerNote;
        return __awaiter(this, void 0, void 0, function () {
            var cartId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCurrentCartGQL()];
                    case 1:
                        cartId = (_b.sent()).cartId;
                        return [2 /*return*/, this.cartActions.updateBuyerNote(cartId, buyerNote)];
                }
            });
        });
    };
    CurrentCartService.prototype.applyCoupon = function (_a, biProps) {
        var code = _a.code;
        return __awaiter(this, void 0, void 0, function () {
            var cartId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCurrentCartGQL()];
                    case 1:
                        cartId = (_b.sent()).cartId;
                        return [2 /*return*/, this.cartActions.applyCouponToCart({ cartId: cartId, couponCode: code }, biProps)];
                }
            });
        });
    };
    CurrentCartService.prototype.removeCoupon = function (biProps) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, cartId, appliedCoupon, couponId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCurrentCartGQL()];
                    case 1:
                        _a = _b.sent(), cartId = _a.cartId, appliedCoupon = _a.appliedCoupon;
                        couponId = appliedCoupon.couponId;
                        return [2 /*return*/, this.cartActions.removeCouponFromCart({ cartId: cartId, couponId: couponId }, biProps)];
                }
            });
        });
    };
    CurrentCartService.prototype.setAddress = function (_a) {
        var address = _a.address;
        return __awaiter(this, void 0, void 0, function () {
            var cartId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCurrentCartGQL()];
                    case 1:
                        cartId = (_b.sent()).cartId;
                        return [2 /*return*/, this.cartActions.setDestinationForEstimation({ destination: address }, cartId)];
                }
            });
        });
    };
    CurrentCartService.prototype.selectShippingOption = function (_a) {
        var selectedShippingOption = _a.selectedShippingOption;
        return __awaiter(this, void 0, void 0, function () {
            var cartId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCurrentCartGQL()];
                    case 1:
                        cartId = (_b.sent()).cartId;
                        return [2 /*return*/, this.cartActions.setShippingOption(cartId, selectedShippingOption)];
                }
            });
        });
    };
    CurrentCartService.prototype.setCurrentCartPromiseAndPublishUpdatedEvent = function (cartPromise) {
        this.cartPromise = cartPromise;
        this.notifyChange();
    };
    CurrentCartService.prototype.listenToSideCartRequests = function () {
        this.subscribeToSideCartEvent(SideCartEvents.GetGQLRequest, this.getCurrentCartGQL.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.GetRequest, this.getCurrentCart.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.RefreshRequest, this.refresh.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.UpdateQuantityRequest, this.updateLineItemQuantity.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.RemoveItemRequest, this.removeLineItem.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.UpdateBuyerNoteRequest, this.updateBuyerNote.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.ApplyCouponRequest, this.applyCoupon.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.RemoveCouponRequest, this.removeCoupon.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.SetAddressRequest, this.setAddress.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.SelectShippingOptionRequest, this.selectShippingOption.bind(this));
        this.subscribeToSideCartEvent(SideCartEvents.EstimateCurrentCartTotals, this.estimateCurrentCartTotals.bind(this));
    };
    CurrentCartService.prototype.subscribeToSideCartEvent = function (event, performAction) {
        var _this = this;
        this.apis.pubSub.subscribe(event, 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        function (_a) {
            var data = _a.data;
            return __awaiter(_this, void 0, void 0, function () {
                var _b, key, payload, _c, _d, _e, _f, _g;
                var _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _b = JSON.parse(data), key = _b.key, payload = _b.payload;
                            _d = (_c = this.apis.pubSub).publish;
                            _e = [SideCartEvents.ActionResponse];
                            _g = (_f = JSON).stringify;
                            _h = { key: key };
                            return [4 /*yield*/, performAction.apply(void 0, __spreadArray([], __read((payload || [])), false))];
                        case 1:
                            _d.apply(_c, _e.concat([_g.apply(_f, [(_h.payload = _j.sent(), _h)]),
                                false]));
                            return [2 /*return*/];
                    }
                });
            });
        }, false);
    };
    CurrentCartService.prototype.listenToCurrentCartEvents = function () {
        var _this = this;
        var currency = this.siteStore.location.query.currency;
        this.siteStore.location.onChange(function () {
            if (currency !== _this.siteStore.location.query.currency) {
                currency = _this.siteStore.location.query.currency;
                void _this.refresh();
            }
        });
        this.siteStore.pubSubManager.subscribe('Cart.Cleared', function (res) {
            _this.getCurrentCartGQL().then(function (_a) {
                var cartId = _a.cartId;
                if (res.data.cartId === cartId) {
                    _this.setCurrentCartPromiseAndPublishUpdatedEvent(Promise.resolve({ items: [] }));
                    _this.invalidateCurrentCartCache();
                }
            });
        });
        this.siteStore.pubSubManager.subscribe('Cart.Changed', function (res) {
            _this.getCurrentCartGQL().then(function (_a) {
                var cartId = _a.cartId;
                return __awaiter(_this, void 0, void 0, function () {
                    var cartPromise, cart;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                cartPromise = ((_b = res.data.eventOptions) === null || _b === void 0 ? void 0 : _b.originatedInWorker) && cartId
                                    ? Promise.resolve(res.data)
                                    : this.getCurrentCartFromServerAndSaveToCache();
                                this.setCurrentCartPromiseAndPublishUpdatedEvent(cartPromise);
                                return [4 /*yield*/, cartPromise];
                            case 1:
                                cart = _c.sent();
                                this.saveCartToCache(cart);
                                return [2 /*return*/];
                        }
                    });
                });
            });
        });
        this.siteStore.pubSubManager.subscribe('Cart.Invalidated', function () {
            _this.invalidateCurrentCartCache();
        });
        this.siteStore.siteApis.onInstanceChanged(function () { return void _this.refresh(); }, APP_DEFINITION_ID);
        if (this.siteStore.experiments.enabled(SPECS.MoveMiniCartInitialization)) {
            this.siteStore.pubSubManager.subscribe(MiniCartEvents.LoadWithoutData, function () {
                _this.getCurrentCartGQL().then(function (cart) {
                    _this.siteStore.pubSubManager.publish(MiniCartEvents.OnInitialData, cart);
                });
            });
        }
    };
    CurrentCartService.prototype.invalidateCurrentCartCache = function () {
        this.apis.storage.memory.removeItem(CACHE_KEY);
    };
    CurrentCartService.prototype.publishCurrentCartUpdated = function () {
        this.siteStore.pubSubManager.publish('CurrentCart.Updated', {});
    };
    CurrentCartService.prototype.getCurrentCartFromCacheOrServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cachedCart;
            return __generator(this, function (_a) {
                cachedCart = this.getCartFromCache();
                if (cachedCart) {
                    return [2 /*return*/, cachedCart];
                }
                return [2 /*return*/, this.getCurrentCartFromServerAndSaveToCache()];
            });
        });
    };
    CurrentCartService.prototype.getCurrentCartFromServerAndSaveToCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cartActions.getCurrentCart(__assign(__assign({}, DEFAULT_CART_OPTIONS), { locale: this.siteStore.storeLanguage }))];
                    case 1:
                        cart = _a.sent();
                        this.saveCartToCache(cart);
                        return [2 /*return*/, cart];
                }
            });
        });
    };
    CurrentCartService.prototype.saveCartToCache = function (cart) {
        this.apis.storage.memory.setItem(CACHE_KEY, JSON.stringify(cart));
    };
    CurrentCartService.prototype.getCartFromCache = function () {
        var cachedCart = this.apis.storage.memory.getItem(CACHE_KEY);
        return cachedCart ? JSON.parse(cachedCart) : undefined;
    };
    return CurrentCartService;
}(BaseCurrentCartService));
export { CurrentCartService };
//# sourceMappingURL=CurrentCartService.js.map