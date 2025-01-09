import { __extends } from "tslib";
import { CartActions } from '../../actions/CartActions/CartActions';
import { SideCartEvents } from '../../constants';
import { BaseCurrentCartService } from './CurrentCartService';
var origin = 'current-cart-service';
var SideCartCurrentCartService = /** @class */ (function (_super) {
    __extends(SideCartCurrentCartService, _super);
    function SideCartCurrentCartService(props) {
        var _this = _super.call(this, props) || this;
        _this.resolvers = {};
        _this.cartActions = new CartActions({ siteStore: _this.siteStore, origin: origin, originatedInWorker: true });
        return _this;
    }
    SideCartCurrentCartService.prototype.init = function () {
        this.listenOnCacheChanges();
    };
    SideCartCurrentCartService.prototype.getCurrentCart = function () {
        return this.performActionOnMainCurrentCartService(SideCartEvents.GetRequest);
    };
    SideCartCurrentCartService.prototype.getCurrentCartGQL = function (_options) {
        return this.performActionOnMainCurrentCartService(SideCartEvents.GetGQLRequest);
    };
    SideCartCurrentCartService.prototype.estimateCurrentCartTotals = function (options) {
        return this.performActionOnMainCurrentCartService(SideCartEvents.EstimateCurrentCartTotals, [options]);
    };
    SideCartCurrentCartService.prototype.refresh = function () {
        return this.performActionOnMainCurrentCartService(SideCartEvents.RefreshRequest);
    };
    SideCartCurrentCartService.prototype.updateLineItemQuantity = function (options, biProps) {
        return this.performActionOnMainCurrentCartService(SideCartEvents.UpdateQuantityRequest, [options, biProps]);
    };
    SideCartCurrentCartService.prototype.removeLineItem = function (options, biProps) {
        return this.performActionOnMainCurrentCartService(SideCartEvents.RemoveItemRequest, [options, biProps]);
    };
    SideCartCurrentCartService.prototype.updateBuyerNote = function (options) {
        return this.performActionOnMainCurrentCartService(SideCartEvents.UpdateBuyerNoteRequest, [options]);
    };
    SideCartCurrentCartService.prototype.applyCoupon = function (options, biProps) {
        return this.performActionOnMainCurrentCartService(SideCartEvents.ApplyCouponRequest, [options, biProps]);
    };
    SideCartCurrentCartService.prototype.removeCoupon = function (biProps) {
        return this.performActionOnMainCurrentCartService(SideCartEvents.RemoveCouponRequest, [biProps]);
    };
    SideCartCurrentCartService.prototype.setAddress = function (options) {
        return this.performActionOnMainCurrentCartService(SideCartEvents.SetAddressRequest, [options]);
    };
    SideCartCurrentCartService.prototype.selectShippingOption = function (options) {
        return this.performActionOnMainCurrentCartService(SideCartEvents.SelectShippingOptionRequest, [options]);
    };
    SideCartCurrentCartService.prototype.listenOnCacheChanges = function () {
        var _this = this;
        this.apis.pubSub.subscribe(SideCartEvents.ActionResponse, function (_a) {
            var _b, _c;
            var data = _a.data;
            var _d = JSON.parse(data), payload = _d.payload, key = _d.key;
            (_c = (_b = _this.resolvers)[key]) === null || _c === void 0 ? void 0 : _c.call(_b, payload);
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete _this.resolvers[key];
        }, false);
        this.apis.pubSub.subscribe('CurrentCart.Updated', function () {
            _this.runCallbacks();
        }, false);
    };
    SideCartCurrentCartService.prototype.performActionOnMainCurrentCartService = function (event, payload) {
        var _this = this;
        if (payload === void 0) { payload = undefined; }
        var key = generateRequestKey(event);
        var promise = new Promise(function (resolve) { return (_this.resolvers[key] = resolve); });
        this.apis.pubSub.publish(event, JSON.stringify({ key: key, payload: payload }), false);
        return promise;
    };
    return SideCartCurrentCartService;
}(BaseCurrentCartService));
export { SideCartCurrentCartService };
var generateSideCartGetRequestKey = function () {
    return "".concat(Date.now(), "-").concat(Math.random());
};
var generateRequestKey = function (prefix) {
    return "".concat(prefix, "-").concat(generateSideCartGetRequestKey());
};
//# sourceMappingURL=SideCartCurrentCartService.js.map