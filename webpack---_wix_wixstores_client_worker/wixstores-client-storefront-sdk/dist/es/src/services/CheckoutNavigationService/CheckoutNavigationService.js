import { __assign, __awaiter, __generator } from "tslib";
import { PageMap, ModalManager } from '@wix/wixstores-client-core';
import { baseModalUrl, ModalType } from './constants';
import _ from 'lodash';
import { CheckoutNavigationApi } from '../../apis/CheckoutNavigationApi/CheckoutNavigationApi';
import { ONE_HUNDRED_THOUSAND, SPECS } from '../../constants';
import { getAdditionalFeesPrice, getCatalogAppIds, getNumberOfAdditionalFees } from '../../utils/cart/bi.utils';
import { graphqlCartToCartSummary } from '../../apis/CartApi/graphqlCartToCartSummary';
var CheckoutNavigationService = /** @class */ (function () {
    function CheckoutNavigationService(_a) {
        var siteStore = _a.siteStore, origin = _a.origin;
        var _this = this;
        this.openModal = function (url, width, height) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.siteStore.windowApis.openModal(url, { width: width, height: height, theme: "BARE" /* ModalTheme.BARE */ })];
                    case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.message];
                }
            });
        }); };
        this.sendLostBusinessEmail = function (isPremium) {
            isPremium && _this.checkoutNavigationApi.notifyLostBusinessNotifier();
        };
        this.isSubscriptionsPremiumFeature = function () {
            return (_.findIndex(_this.siteStore.premiumFeatures, function (feature) {
                return feature.name === 'stores_subscriptions';
            }) !== -1);
        };
        this.origin = origin;
        this.siteStore = siteStore;
        this.checkoutNavigationApi = new CheckoutNavigationApi({ siteStore: this.siteStore, origin: this.origin });
        this.modalManger = new ModalManager({ openModal: this.openModal }, baseModalUrl, this.siteStore.instanceManager.getInstance());
    }
    CheckoutNavigationService.prototype.openModalByType = function (modalType, isEditorX, cart) {
        return __awaiter(this, void 0, void 0, function () {
            var cartSummary, additionalFeesPrice, additionalFeesNumber, catalogAppId;
            return __generator(this, function (_a) {
                cartSummary = graphqlCartToCartSummary(cart);
                additionalFeesPrice = getAdditionalFeesPrice(cartSummary);
                additionalFeesNumber = getNumberOfAdditionalFees(cartSummary);
                catalogAppId = getCatalogAppIds(cartSummary);
                return [2 /*return*/, this.openLegacyCartModal(modalType, {
                        destination: cart.destination,
                        catalogAppId: catalogAppId,
                        additionalFeesPrice: additionalFeesPrice,
                        additionalFeesNumber: additionalFeesNumber,
                    }, isEditorX)];
            });
        });
    };
    CheckoutNavigationService.prototype.openLegacyCartModal = function (modalType, _a, isEditorX) {
        var destination = _a.destination, catalogAppId = _a.catalogAppId, additionalFeesPrice = _a.additionalFeesPrice, additionalFeesNumber = _a.additionalFeesNumber;
        return __awaiter(this, void 0, void 0, function () {
            var biParams, mode, _b, response;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        biParams = { origin: this.origin, isMerchant: true };
                        mode = this.siteStore.biStorefrontViewMode;
                        _b = modalType;
                        switch (_b) {
                            case ModalType.SetShipping: return [3 /*break*/, 1];
                            case ModalType.SetPayment: return [3 /*break*/, 2];
                            case ModalType.CantShipToDestination: return [3 /*break*/, 3];
                            case ModalType.UpgradeToPremium: return [3 /*break*/, 4];
                            case ModalType.NotInLiveSite: return [3 /*break*/, 6];
                            case ModalType.Subscriptions: return [3 /*break*/, 7];
                            case ModalType.HighArpuSubscriptions: return [3 /*break*/, 8];
                            case ModalType.NoOnlinePayments: return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 10];
                    case 1:
                        {
                            void this.siteStore.platformBiLogger.cartShowMerchantShippingPopup({
                                type: 'merchant pop-up',
                                origin: this.origin,
                                catalogAppId: catalogAppId,
                                mode: mode,
                            });
                            return [2 /*return*/, this.modalManger.openSetShippingMethod()];
                        }
                        _c.label = 2;
                    case 2:
                        {
                            void this.siteStore.platformBiLogger.checkoutShowMerchantPaymentPopupSf(__assign(__assign({}, biParams), { catalogAppId: catalogAppId }));
                            return [2 /*return*/, this.modalManger.openSetPaymentMethod()];
                        }
                        _c.label = 3;
                    case 3:
                        {
                            return [2 /*return*/, this.modalManger.openCantShipToDestination({
                                    countryKey: destination.country,
                                    subdivisionKey: destination.subdivision,
                                })];
                        }
                        _c.label = 4;
                    case 4:
                        //eslint-disable-next-line @typescript-eslint/no-floating-promises
                        this.siteStore.biLogger.showMerchantUpgradePopupSf(biParams);
                        return [4 /*yield*/, this.modalManger.openUpgradeToPremium({ isEditorX: Boolean(isEditorX) })];
                    case 5:
                        response = _c.sent();
                        if (response === null || response === void 0 ? void 0 : response.proceed) {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.biLogger.clickNoThanksOnMerchantUpgradePopupSf({});
                        }
                        return [2 /*return*/, response];
                    case 6:
                        {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.biLogger.viewCheckoutInLiveSitePopupSf(biParams);
                            return [2 /*return*/, this.modalManger.openNotInLiveSite()];
                        }
                        _c.label = 7;
                    case 7:
                        {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.platformBiLogger.checkoutNotAbleToAcceptPaymentsVisitorPopupSf({
                                origin: this.origin,
                                additionalFeesPrice: additionalFeesPrice * ONE_HUNDRED_THOUSAND,
                                numberOfAdditionalFees: additionalFeesNumber,
                                catalogAppId: catalogAppId,
                            });
                            return [2 /*return*/, this.modalManger.openSubscriptions()];
                        }
                        _c.label = 8;
                    case 8:
                        {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.biLogger.subscriptionsAreComingSoonVisitorPopupSf({ origin: this.origin });
                            return [2 /*return*/, this.modalManger.openUpgradeSubscriptions({ isEditorX: Boolean(isEditorX) })];
                        }
                        _c.label = 9;
                    case 9:
                        {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.platformBiLogger.checkoutNotAbleToAcceptPaymentsVisitorPopupSf({
                                origin: this.origin,
                                additionalFeesPrice: additionalFeesPrice * ONE_HUNDRED_THOUSAND,
                                numberOfAdditionalFees: additionalFeesNumber,
                                catalogAppId: catalogAppId,
                            });
                            return [2 /*return*/, this.modalManger.openNoOnlinePayments()];
                        }
                        _c.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /* eslint-disable sonarjs/cognitive-complexity */
    /* eslint-disable sonarjs/no-duplicated-branches */
    CheckoutNavigationService.prototype.checkIsAllowedToCheckout = function (_a) {
        var isPremium = _a.isPremium, canStoreShip = _a.canStoreShip, hasCreatedPaymentMethods = _a.hasCreatedPaymentMethods, isSubscribe = _a.isSubscribe, canShipToDestination = _a.canShipToDestination, fullPaymentOffline = _a.fullPaymentOffline, hasShippableItems = _a.hasShippableItems;
        var canStoreShipIfNeeded = !hasShippableItems || canStoreShip;
        var isOwner = this.siteStore.isOwner;
        var isLiveSite = !(this.siteStore.isPreviewMode() || this.siteStore.isEditorMode());
        var needsAndHasPaymentMethods = !!hasCreatedPaymentMethods || !!fullPaymentOffline;
        if (!isLiveSite || isOwner) {
            if (!canStoreShipIfNeeded) {
                return { modalType: ModalType.SetShipping, canCheckout: false };
            }
            else if (!canShipToDestination) {
                return { modalType: ModalType.CantShipToDestination, canCheckout: false };
            }
            else if (!hasCreatedPaymentMethods) {
                return { modalType: ModalType.SetPayment, canCheckout: false };
            }
            else if (!isPremium) {
                return { modalType: ModalType.UpgradeToPremium, canCheckout: false };
            }
            else if (isSubscribe && !this.isSubscriptionsPremiumFeature()) {
                return { modalType: ModalType.HighArpuSubscriptions, canCheckout: false };
            }
            else if (!isLiveSite) {
                return { modalType: ModalType.NotInLiveSite, canCheckout: false };
            }
        }
        else if (!canShipToDestination) {
            return { modalType: ModalType.CantShipToDestination, canCheckout: false };
        }
        else if (!needsAndHasPaymentMethods || !canStoreShipIfNeeded) {
            if (this.siteStore.experiments.enabled(SPECS.fixEmailNotifierInCart)) {
                return { modalType: ModalType.NoOnlinePayments, canCheckout: false, shouldNotify: true };
            }
            else {
                this.sendLostBusinessEmail(isPremium);
                return { modalType: ModalType.NoOnlinePayments, canCheckout: false };
            }
        }
        else if (isSubscribe && !this.isSubscriptionsPremiumFeature()) {
            return { modalType: ModalType.Subscriptions, canCheckout: false };
        }
        return { canCheckout: true };
    };
    CheckoutNavigationService.prototype.checkoutInfoToQueryParams = function (checkoutInfo) {
        var _a;
        return __assign(__assign(__assign(__assign(__assign(__assign({ a11y: checkoutInfo.a11y, cartId: checkoutInfo.cartId, storeUrl: checkoutInfo.siteBaseUrl, cashierPaymentId: (_a = checkoutInfo.cashierPaymentId) !== null && _a !== void 0 ? _a : '', origin: this.origin, originType: checkoutInfo.originType }, (checkoutInfo.successUrl ? { successUrl: checkoutInfo.successUrl } : {})), (checkoutInfo.theme ? { theme: checkoutInfo.theme } : {})), (checkoutInfo.isPickupOnly ? { isPickupFlow: checkoutInfo.isPickupOnly } : {})), (checkoutInfo.checkoutId ? { checkoutId: checkoutInfo.checkoutId } : {})), (checkoutInfo.continueShoppingUrl ? { continueShoppingUrl: checkoutInfo.continueShoppingUrl } : {})), (checkoutInfo.isPreselectedFlow !== undefined
            ? { isPreselectedFlow: checkoutInfo.isPreselectedFlow }
            : /* istanbul ignore next */ {}));
    };
    CheckoutNavigationService.prototype.navigateToCheckout = function (checkoutInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var urlParams;
            return __generator(this, function (_a) {
                urlParams = __assign({ checkoutOOI: 'true' }, (checkoutInfo.disableContinueShopping ? { disableContinueShopping: 'true' } : {}));
                this.siteStore.navigate({
                    sectionId: PageMap.CHECKOUT,
                    queryParams: this.checkoutInfoToQueryParams(checkoutInfo),
                    urlParams: urlParams,
                }, true);
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    return CheckoutNavigationService;
}());
export { CheckoutNavigationService };
//# sourceMappingURL=CheckoutNavigationService.js.map