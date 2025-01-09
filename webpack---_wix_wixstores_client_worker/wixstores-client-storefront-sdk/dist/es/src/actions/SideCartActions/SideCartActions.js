import { __awaiter, __extends, __generator } from "tslib";
import { SPECS } from '../../constants';
import { MinicartActions } from '../MiniCartActions/MinicartActions';
import { PageMap } from '@wix/wixstores-client-core';
var SideCartActions = /** @class */ (function (_super) {
    __extends(SideCartActions, _super);
    function SideCartActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SideCartActions.prototype.showMiniCartOrSideCart = function () {
        var _this = this;
        var shouldUseSideCart = this.siteStore.experiments.enabled(SPECS.ShouldUseSideCart);
        if (!shouldUseSideCart) {
            return this.showMiniCartWithoutMobile();
        }
        var shouldNavigateToCart = this.siteStore.experiments.enabled(SPECS.NavigateToCartWhenDontShowSideCartOnMobile) &&
            this.siteStore.isMobile() &&
            this.siteStore.dontShowSideCartOnMobile;
        if (shouldNavigateToCart) {
            throw Error("Migrated Side Cart can't be open in mobile");
        }
        return this.getSideCartLightbox().then(function (sideCartLightbox) {
            if (sideCartLightbox) {
                _this.openSideCart(sideCartLightbox.id);
            }
            else {
                return _this.showMiniCartWithoutMobile();
            }
        });
    };
    SideCartActions.prototype.showMiniCartWithoutMobile = function () {
        if (this.siteStore.isMobile()) {
            throw Error("can't open mini cart in mobile");
        }
        this.showMinicart();
    };
    SideCartActions.prototype.openSideCart = function (id) {
        void this.siteStore.windowApis.openLightboxById(id, {});
    };
    SideCartActions.prototype.getSideCartLightbox = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var siteStructure;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.siteStore.wixCodeApi.site.getSiteStructure({ includePageId: true })];
                    case 1:
                        siteStructure = _b.sent();
                        return [2 /*return*/, (_a = siteStructure.lightboxes) === null || _a === void 0 ? void 0 : _a.find(function (lightbox) { return lightbox.tpaPageId === PageMap.SIDE_CART; })];
                }
            });
        });
    };
    SideCartActions.prototype.hasSideCart = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sideCartLightbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.siteStore.experiments.enabled(SPECS.ShouldUseSideCart)) return [3 /*break*/, 1];
                        return [2 /*return*/, false];
                    case 1: return [4 /*yield*/, this.getSideCartLightbox()];
                    case 2:
                        sideCartLightbox = _a.sent();
                        return [2 /*return*/, !!sideCartLightbox];
                }
            });
        });
    };
    return SideCartActions;
}(MinicartActions));
export { SideCartActions };
//# sourceMappingURL=SideCartActions.js.map