import { __assign } from "tslib";
/* eslint-disable @typescript-eslint/no-floating-promises */
import { getCatalogAppIds } from '../utils/cart/bi.utils';
import { graphqlCartToCartSummary } from './CartApi/graphqlCartToCartSummary';
var BIService = /** @class */ (function () {
    function BIService(_a) {
        var siteStore = _a.siteStore, origin = _a.origin;
        var _this = this;
        this.updateBuyerNote = function (cart, hasNote) {
            var biParams = __assign({ cartId: cart.cartId }, _this.baseParams);
            var cartSummary = graphqlCartToCartSummary(cart);
            var catalogAppId = getCatalogAppIds(cartSummary);
            var checkoutId = cartSummary.checkoutId;
            hasNote
                ? _this.siteStore.platformBiLogger.saveNoteToSellerSf(__assign(__assign({}, biParams), { is_empty: false, catalogAppId: catalogAppId, checkoutId: checkoutId }))
                : _this.siteStore.platformBiLogger.deleteNoteToSellerSf(__assign(__assign({}, biParams), { catalogAppId: catalogAppId, checkoutId: checkoutId }));
        };
        this.siteStore = siteStore;
        this.origin = origin;
    }
    Object.defineProperty(BIService.prototype, "baseParams", {
        get: function () {
            return {
                origin: this.origin,
            };
        },
        enumerable: false,
        configurable: true
    });
    return BIService;
}());
export { BIService };
//# sourceMappingURL=BIService.js.map