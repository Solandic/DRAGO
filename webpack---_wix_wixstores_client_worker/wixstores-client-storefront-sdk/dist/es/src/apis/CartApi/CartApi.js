import { __assign, __awaiter, __extends, __generator } from "tslib";
import { GraphQLOperations, RemoteSourceTypes, RestCommands } from '../constants';
import { queries as cartQueries } from '../../graphql/cart.graphql';
import { queries as deprecatedQueries } from '../../graphql/deprecated.graphql';
import { BaseApi } from '../BaseApi';
import { graphqlCartToCartSummary } from './graphqlCartToCartSummary';
import _ from 'lodash';
import { GetLegacyCartDocument, } from '../../graphql/__generated__/getLegacyCart';
import { BIService } from '../BIService';
import { GetLegacyCartOrCheckoutDocument, } from '../../graphql/__generated__/getLegacyCartOrCheckout';
import { DEFAULT_CART_OPTIONS } from '../../constants';
var CartApi = /** @class */ (function (_super) {
    __extends(CartApi, _super);
    function CartApi(_a) {
        var siteStore = _a.siteStore, origin = _a.origin, _b = _a.locale, locale = _b === void 0 ? 'en' : _b;
        var _this = _super.call(this, { siteStore: siteStore, origin: origin }) || this;
        _this.locale = locale;
        _this.biService = new BIService({ siteStore: siteStore, origin: origin });
        return _this;
    }
    CartApi.prototype.commandPost = function (command, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.post(this.endpoints.cartCommmands(command), data)];
            });
        });
    };
    CartApi.prototype.createVolatileCart = function (variables) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mutate({
                            variables: variables,
                            query: deprecatedQueries.createVolatileCartMutation,
                            operationName: GraphQLOperations.CreateCart,
                        })];
                    case 1: return [2 /*return*/, (_a.sent()).checkout.createCart];
                }
            });
        });
    };
    CartApi.prototype.addToCart = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!inputs || inputs.length === 0) {
                            throw Error('Invalid addToCart request (no items were specified to be added to the cart)');
                        }
                        inputs.forEach(function (input) {
                            if (!input.productId) {
                                throw Error('Invalid product id (should be a GUID)');
                            }
                            if (!Number.isInteger(input.quantity) || input.quantity < 1) {
                                throw Error('Invalid quantity (should be rational and greater than 0)');
                            }
                            if (input.customTextFieldSelections && input.customTextFieldSelections.length > 0) {
                                input.customTextFieldSelections.forEach(function (field) {
                                    field.title = String(field.title);
                                    field.value = String(field.value);
                                });
                            }
                        });
                        return [4 /*yield*/, this.mutate({
                                variables: __assign({ params: inputs }, this.getExtraCartMutationOptions()),
                                query: this.getCartQueries().addToCartMutation,
                                operationName: GraphQLOperations.AddToCart,
                            }, function (response) { return _.get(response, 'data.cart.addToCart.errors[0].message', null); })];
                    case 1: return [2 /*return*/, (_a.sent()).cart.addToCart.cart];
                }
            });
        });
    };
    CartApi.prototype.fetchCart = function (variables, source) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var response, cart;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        variables = {
                            locale: (_a = variables === null || variables === void 0 ? void 0 : variables.locale) !== null && _a !== void 0 ? _a : 'en',
                            withTax: (_b = variables === null || variables === void 0 ? void 0 : variables.withTax) !== null && _b !== void 0 ? _b : false,
                            withShipping: (_c = variables === null || variables === void 0 ? void 0 : variables.withShipping) !== null && _c !== void 0 ? _c : false,
                        };
                        return [4 /*yield*/, this.fetch({
                                variables: variables,
                                query: this.getCartQueries().getCartQuery,
                                operationName: GraphQLOperations.GetCart,
                                source: source,
                            }, RemoteSourceTypes.NodeReadWrite, true)];
                    case 1:
                        response = _d.sent();
                        cart = response.data.cart;
                        return [2 /*return*/, graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    /*istanbul ignore next */
    CartApi.prototype.fetchCartLegacyOrCheckoutPlatform = function (_a, source) {
        var cartId = _a.cartId, _b = _a.locale, locale = _b === void 0 ? 'en' : _b, _c = _a.withTax, withTax = _c === void 0 ? false : _c, _d = _a.withShipping, withShipping = _d === void 0 ? false : _d;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            variables: { cartId: cartId, locale: locale, withTax: withTax, withShipping: withShipping },
                            query: GetLegacyCartDocument,
                            operationName: GraphQLOperations.GetLegacyCart,
                            source: source,
                        }, RemoteSourceTypes.NodeReadWrite, true)];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, response.data.cartService.cart];
                }
            });
        });
    };
    /*istanbul ignore next */
    CartApi.prototype.fetchCartLegacyOrCheckout = function (_a, source) {
        var checkoutId = _a.checkoutId, cartId = _a.cartId, _b = _a.locale, locale = _b === void 0 ? 'en' : _b, _c = _a.withTax, withTax = _c === void 0 ? false : _c, _d = _a.withShipping, withShipping = _d === void 0 ? false : _d;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            //@ts-expect-error
                            variables: { cartId: cartId, checkoutId: checkoutId, locale: locale, withTax: withTax, withShipping: withShipping },
                            query: GetLegacyCartOrCheckoutDocument,
                            operationName: GraphQLOperations.GetLegacyCartOrCheckout,
                            source: source,
                        }, RemoteSourceTypes.NodeReadWrite, true)];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, response.data.cartService.cart];
                }
            });
        });
    };
    CartApi.prototype.removeItemMutation = function (cartId, cartItemId) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = { cartId: cartId, cartItemId: cartItemId };
                return [2 /*return*/, this.mutate({
                        variables: __assign({ params: params }, this.getExtraCartMutationOptions()),
                        query: this.getCartQueries().removeItemMutation,
                        operationName: GraphQLOperations.RemoveItem,
                    })];
            });
        });
    };
    CartApi.prototype.removeItem = function (_a) {
        var cartId = _a.cartId, cartItemId = _a.cartItemId;
        return __awaiter(this, void 0, void 0, function () {
            var cart;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.removeItemMutation(cartId, cartItemId)];
                    case 1:
                        cart = (_b.sent()).cart.removeItem.cart;
                        return [2 /*return*/, graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.updateItemQuantityMutation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.mutate({
                        variables: __assign({ params: params }, this.getExtraCartMutationOptions()),
                        query: this.getCartQueries().updateItemQuantityMutation,
                        operationName: GraphQLOperations.UpdateItemQuantity,
                    })];
            });
        });
    };
    CartApi.prototype.updateItemQuantity = function (_a) {
        var cartId = _a.cartId, cartItemId = _a.cartItemId, quantity = _a.quantity;
        return __awaiter(this, void 0, void 0, function () {
            var cart;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!Number.isInteger(quantity) || quantity < 1) {
                            throw Error('Invalid quantity (should be rational and greater than 0)');
                        }
                        return [4 /*yield*/, this.updateItemQuantityMutation({
                                cartId: cartId,
                                cartItemId: cartItemId,
                                quantity: quantity,
                            })];
                    case 1:
                        cart = (_b.sent()).cart.updateItemQuantity.cart;
                        return [2 /*return*/, graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.updateBuyerNoteMutation = function (cartId, buyerNote) {
        if (buyerNote === void 0) { buyerNote = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var cart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mutate({
                            variables: __assign({ params: { cartId: cartId, buyerNote: buyerNote } }, this.getExtraCartMutationOptions()),
                            query: this.getCartQueries().updateBuyerNoteMutation,
                            operationName: GraphQLOperations.UpdateBuyerNote,
                        })];
                    case 1:
                        cart = (_a.sent()).cart.updateBuyerNote.cart;
                        return [2 /*return*/, graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.updateBuyerNote = function (data, _a, withBi) {
        var cart = _a.cart;
        if (withBi === void 0) { withBi = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.updateBuyerNoteMutation(cart.cartId, data.content)];
                    case 1:
                        _b.sent();
                        if (withBi) {
                            this.biService.updateBuyerNote(cart, !!data.content);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CartApi.prototype.setDestinationForEstimation = function (data, cartId) {
        return __awaiter(this, void 0, void 0, function () {
            var cart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mutate({
                            variables: __assign({ params: { cartId: cartId, address: data.destination } }, this.getExtraCartMutationOptions()),
                            query: this.getCartQueries().setDestinationForEstimationMutation,
                            operationName: GraphQLOperations.SetDestinationForEstimation,
                        })];
                    case 1:
                        cart = (_a.sent()).cart.setDestinationForEstimation.cart;
                        return [2 /*return*/, graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.setShippingOption = function (cartId, selectedShippingOption) {
        return __awaiter(this, void 0, void 0, function () {
            var cart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mutate({
                            variables: __assign({ params: { cartId: cartId, selectedShippingOption: selectedShippingOption } }, this.getExtraCartMutationOptions()),
                            query: this.getCartQueries().setShippingOptionMutation,
                            operationName: GraphQLOperations.SetCartShippingOptionNew,
                        })];
                    case 1:
                        cart = (_a.sent()).cart.setShippingOption.cart;
                        return [2 /*return*/, graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.setCouponMutation = function (cartId, code, userIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var params, cart, maybeErrors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { cartId: cartId, code: code, userIdentifier: userIdentifier };
                        return [4 /*yield*/, this.mutate({
                                variables: __assign({ params: params }, this.getExtraCartMutationOptions()),
                                query: this.getCartQueries().setCouponMutation,
                                operationName: GraphQLOperations.SetCoupon,
                            })];
                    case 1:
                        cart = (_a.sent()).cart;
                        maybeErrors = cart.setCoupon.errors;
                        if (Array.isArray(maybeErrors) && maybeErrors.length > 0) {
                            // eslint-disable-next-line @typescript-eslint/no-throw-literal
                            throw { success: false, errors: maybeErrors };
                        }
                        return [2 /*return*/, cart.setCoupon.cart];
                }
            });
        });
    };
    CartApi.prototype.applyCoupon = function (cartId, code, userIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var cart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setCouponMutation(cartId, code, userIdentifier)];
                    case 1:
                        cart = _a.sent();
                        return [2 /*return*/, graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.removeCoupon = function (_a) {
        var cartId = _a.cartId, couponId = _a.couponId;
        return __awaiter(this, void 0, void 0, function () {
            var cart;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.mutate({
                            variables: __assign({ params: { cartId: cartId, couponId: couponId } }, this.getExtraCartMutationOptions()),
                            query: this.getCartQueries().removeCouponMutation,
                            operationName: GraphQLOperations.RemoveCoupon,
                        })];
                    case 1:
                        cart = (_b.sent()).cart.removeCoupon.cart;
                        return [2 /*return*/, graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.deleteCart = function (data, onDelete) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commandPost(RestCommands.CartDelete, data)];
                    case 1:
                        _a.sent();
                        void onDelete(data);
                        return [2 /*return*/];
                }
            });
        });
    };
    CartApi.prototype.getCartQueries = function () {
        return cartQueries;
    };
    CartApi.prototype.getExtraCartMutationOptions = function () {
        return __assign({ locale: this.locale }, DEFAULT_CART_OPTIONS);
    };
    return CartApi;
}(BaseApi));
export { CartApi };
//# sourceMappingURL=CartApi.js.map