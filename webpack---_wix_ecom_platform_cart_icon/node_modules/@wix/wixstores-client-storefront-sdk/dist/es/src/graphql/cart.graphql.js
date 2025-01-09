import { cartResponse, cartWithErrorsResponse } from './schema/cartResponse';
var getCartQuery = "query getCart($locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  ".concat(cartResponse, "\n}");
var addToCartMutation = "mutation addToCart($params: [AddToCartInput!], $locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    addToCart(params: $params) {\n      ".concat(cartWithErrorsResponse, "\n    }\n  }\n}\n");
var addCustomItemsToCartMutation = "mutation addCustomItemsToCart($params: AddCustomItemsToCartParams!, $locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    addCustomItemsToCart(params: $params) {\n      ".concat(cartWithErrorsResponse, "\n    }\n  }\n}\n");
var removeItemMutation = "mutation removeItem($params: RemoveItemInput!, $locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    removeItem(params: $params) {\n      ".concat(cartWithErrorsResponse, "\n    }\n  }\n}\n");
var removeCouponMutation = "mutation removeCoupon($params: RemoveCouponInput!, $locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    removeCoupon(params: $params) {\n      ".concat(cartWithErrorsResponse, "\n    }\n  }\n}\n");
var setCouponMutation = "mutation setCoupon($params: SetCouponInput!, $locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    setCoupon(params: $params) {\n      ".concat(cartWithErrorsResponse, "\n    }\n  }\n}\n");
var updateBuyerNoteMutation = "mutation updateBuyerNote($params: UpdateBuyerNoteInput!, $locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    updateBuyerNote(params: $params) {\n      ".concat(cartWithErrorsResponse, "\n    }\n  }\n}\n");
var updateItemQuantityMutation = "mutation updateItemQuantity($params: UpdateItemQuantityInput!, $locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    updateItemQuantity(params: $params) {\n      ".concat(cartWithErrorsResponse, "\n    }\n  }\n}\n");
var setShippingOptionMutation = "mutation setCartShippingOption($params: SetShippingOptionInput!, $locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    setShippingOption(params: $params) {\n      ".concat(cartWithErrorsResponse, "\n    }\n  }\n}\n");
var setDestinationForEstimationMutation = "mutation setDestinationForEstimation($params: SetDestinationForEstimationInput!, $locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    setDestinationForEstimation(params: $params) {\n      ".concat(cartWithErrorsResponse, "\n    }\n  }\n}\n");
export var queries = {
    getCartQuery: getCartQuery,
    addToCartMutation: addToCartMutation,
    addCustomItemsToCartMutation: addCustomItemsToCartMutation,
    removeItemMutation: removeItemMutation,
    removeCouponMutation: removeCouponMutation,
    setCouponMutation: setCouponMutation,
    updateBuyerNoteMutation: updateBuyerNoteMutation,
    updateItemQuantityMutation: updateItemQuantityMutation,
    setShippingOptionMutation: setShippingOptionMutation,
    setDestinationForEstimationMutation: setDestinationForEstimationMutation,
};
//# sourceMappingURL=cart.graphql.js.map