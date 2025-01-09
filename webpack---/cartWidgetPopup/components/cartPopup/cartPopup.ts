import {CartWidgetPopupService} from '../../services/CartWidgetPopupService';
import {CartDataService} from '../../../common/services/CartDataService';
import {PublicDataSettingsService} from '../../../common/services/PublicDataSettingsService';
import {CartItemService} from '../../../common/services/CartItemService';
import {ORIGIN_CART} from '../../../common/data';
import {SdkEvents} from '@wix/wix-ecommerce-common-storefront/dist/src/services/sdkEvents';
import * as angular from 'angular';
import * as template from './cartPopup.html';
import {ICartItemV2, ICartV2} from '@wix/wix-ecommerce-common-storefront/dist/src/typings/cartDef';
import {IBIData} from '../../../typings/appConfig';
import {ISdkAdapter} from '@wix/ecommerce-sf-sm-common/dist/src/typings/ISdkAdapter';
import {BIEventsList} from '../../../common/constants/biEventsList';
import {ProductType} from '@wix/wix-ecommerce-common-storefront/dist/src/enums/product';
import {CartType} from '@wix/wix-ecommerce-common-storefront/dist/src/enums/cart';
import {AddToCartActionOption} from '@wix/wixstores-client-core/dist/src/constants';
import {Origin, PopupCartType, Specs} from '../../../common/constants/constants';
import {ICartProduct} from '@wix/wixstores-graphql-schema';

export class CartPopupController {
  private resizeTimeout;
  private itemsCount;

  public cartData: ICartV2;
  public totalItemsQuantity: number;
  public addToCartActionOption = AddToCartActionOption.MINI_CART;
  public addedProductId = '';
  public origin = '';
  public isFirstItem = false;
  public isDropdownOpen = false;
  public focusOnChange = false;
  public textSettings = {};
  public isLoaded: boolean;
  public m_isMobileView: boolean;
  private readonly maxQuantity: number = 99999;

  /* @ngInject */
  constructor(
    private readonly $scope: ng.IScope,
    private readonly clientConfig,
    private readonly sdkEvents: SdkEvents,
    private readonly sdkAdapter: ISdkAdapter,
    private readonly pageMap,
    private readonly wixBIAdapter,
    private readonly $timeout: ng.ITimeoutService,
    private readonly CART_WIDGET_WIDTH,
    private readonly cartDataService: CartDataService,
    private readonly cartItemService: CartItemService,
    private readonly publicDataSettingsService: PublicDataSettingsService,
    private readonly cartWidgetPopupService: CartWidgetPopupService,
    private readonly focusManager,
    private readonly $translate,
    private readonly $document: angular.IDocumentService,
    private readonly nga11yAnnounce,
    private readonly experimentManager: ExperimentManager
  ) {
    this.wixBIAdapter.sendBIEvent(BIEventsList.CART_WIDGET_LOADED);
    this.m_isMobileView = sdkAdapter.getDeviceType() === 'mobile';

    this.cartWidgetPopupService.loadCart().then(cart => {
      this.cartData = cart;
      this.itemsCount = this.cartData.items.length;
      this.totalItemsQuantity = this.getTotalItemsQuantity();
    });

    this.cartWidgetPopupService.subscribeCloseThisPopupWhenOtherPopupsAskFor();
    this.cartWidgetPopupService.closeOtherPopups();

    sdkEvents.on('Cart.Changed', cart => this.onChangeCart(cart));
    sdkEvents.on('Minicart.Toggle', () => this.toggleDropdown());
    sdkEvents.on('Minicart.Hide', () => this.hideMinicart());
    sdkEvents.on('Minicart.Show', () => this.showMinicart());
    sdkEvents.on('Tinycart.Show', () => this.showMinicart(true));
    sdkEvents.on('Tinycart.Hide', () => this.hideMinicart());

    this.resizeWindow(true);
    this.isLoaded = false;
    this.loadSettings();
  }

  public setCartData(cartSummary: ICartV2): void {
    this.cartData = cartSummary;
    this.totalItemsQuantity = this.getTotalItemsQuantity();
  }

  private loadSettings() {
    this.publicDataSettingsService.whenLoaded().then(() => {
      this.isLoaded = true;
      this.textSettings = this.publicDataSettingsService.settings;
    });
  }

  public getTotalQuantity(): number {
    return this.cartDataService.getTotalQuantity(this.cartData);
  }

  public hideMinicart(): void {
    this.setDropdownState(false);
  }

  public showMinicart(isTinyCart: boolean = false): void {
    this.addToCartActionOption = isTinyCart ? AddToCartActionOption.TINY_CART : AddToCartActionOption.MINI_CART;
    this.origin = Origin.Velo;
    this.sendOpenMiniCartBi();
    this.setDropdownState(true);
  }

  public toggleDropdown(): void {
    this.origin = Origin.CartIcon;
    !this.isDropdownOpen && this.sendOpenMiniCartBi();
    this.setDropdownState(!this.isDropdownOpen);
  }

  public openDropdown(): void {
    this.origin = Origin.AddToCartButton;
    this.sendOpenMiniCartBi();
    this.setDropdownState(true);
  }

  public sendOpenMiniCartBi(): void {
    const BIData: IBIData = {
      cartId: this.cartDataService.getCartId(),
      origin: this.origin,
      itemsCount: this.getTotalQuantity(),
      viewMode: this.sdkAdapter.getViewMode(),
      type: this.popupCartTypeForBi,
      catalogAppId: this.cartDataService.getCatalogAppIdForBi(),
    };
    this.wixBIAdapter.sendBIEvent(BIEventsList.VIEW_MINI_CART, BIData);
  }

  public openedCart(): void {
    const BIData: IBIData = {
      cartId: this.cartDataService.getCartId(),
      origin: 'cart-popup',
      itemsCount: this.getTotalQuantity(),
      isNavigateCart: true,
      viewMode: this.sdkAdapter.getViewMode(),
      catalogAppId: this.cartDataService.getCatalogAppIdForBi(),
    };
    this.wixBIAdapter.sendBIEvent(BIEventsList.CLICK_TO_VIEW_CART_PAGE, BIData);

    this.closeDropdown();
  }

  public closeDropdown(): void {
    this.setDropdownState(false);
  }

  private setDropdownState(state: boolean): void {
    this.isDropdownOpen = state;
    this.$scope.$applyAsync(() => this.resizeWindow()); // Allows the animation to start and then resize
  }

  public isEmptyState(): boolean {
    return !this.cartData || !this.cartData.items || this.cartData.items.length === 0;
  }

  private setFocusToCartWidget() {
    this.$timeout(() => {
      this.focusManager.activeElement = null;
      this.focusManager.focus(this.$document[0].getElementById('widget-view-cart-button'));
    }, 600);
  }

  public resizeWindow(noDelay?: boolean): void {
    let width = '0%';
    let timeout = 500;
    if (this.isDropdownOpen) {
      width = this.CART_WIDGET_WIDTH;
      timeout = 0;
    }
    if (this.resizeTimeout) {
      this.$timeout.cancel(this.resizeTimeout);
    }
    if (noDelay) {
      timeout = 0;
    }
    this.resizeTimeout = this.$timeout(() => {
      this.sdkAdapter.resizeWindow(
        width,
        '100%',
        this.isDropdownOpen
          ? () => this.setFocusToCartWidget()
          : () => this.sdkEvents.broadcast('Minicart.DidClose', null)
      );
    }, timeout);
  }

  public removeItem(
    cartItemId: string,
    productId: string,
    productType: ProductType,
    productName: string,
    index: number,
    item: ICartItemV2
  ): ng.IPromise<void> {
    const BIData: IBIData = {
      cartId: this.cartDataService.getCartId(),
      origin: 'cart popup',
      itemsCount: this.getTotalQuantity(),
      productType,
      catalogAppId: this.cartDataService.getCatalogAppIdForBi(),
    };

    if (productId) {
      BIData.productId = productId;
    }

    this.trackRemoveFromCart(productId, productName, item);

    const cartId = this.cartDataService.getCartId();

    this.wixBIAdapter.sendBIEvent(BIEventsList.REMOVE_ITEM_FORM_CART, BIData);
    return this.cartItemService.removeItemFromCart(cartItemId, cartId).then(c => {
      this.cartData = c.cartSummary;
      this.totalItemsQuantity = this.getTotalItemsQuantity();
      this.$scope.$applyAsync(() => {
        this.preserveFocusWhenPressedRemoveAtIndex(index);
        this.nga11yAnnounce.politeAnnounce(this.$translate('cartWidget.sr.PRODUCT_WAS_REMOVED', {productName}));
      });
    });
  }

  private trackRemoveFromCart(productId: string, productName: string, item) {
    this.sdkAdapter.trackEvent('RemoveFromCart', {
      id: productId,
      origin: 'Stores',
      name: productName,
      category: 'All Products',
      price: item.comparePrice || item.price,
      currency: this.clientConfig.storeCurrency,
      quantity: item.quantity,
    });
  }

  private preserveFocusWhenPressedRemoveAtIndex(index: number) {
    if (index === 0) {
      index = 1;
    }
    let elementToFocus = this.$document[0].querySelectorAll('.remove-item')[index - 1];
    if (!elementToFocus) {
      elementToFocus = this.$document[0].getElementById('widget-view-cart-button');
    }
    this.focusManager.focus(elementToFocus);
  }

  public getProductSectionId(): string {
    return this.pageMap.product;
  }
  public getCartLineItemId(product: ICartItemV2): string {
    return product.cartItemId;
  }

  public onChangeCart(cart: ICartV2): void {
    this.cartData = cart;
    this.totalItemsQuantity = this.getTotalItemsQuantity();
    const newCount = cart.items.length;
    this.isFirstItem = this.itemsCount === 0 && newCount === 1;
    this.itemsCount = newCount;
    this.addToCartActionOption = cart.eventOptions?.addToCartActionOption;
    this.addedProductId = cart.eventOptions?.addedProductId;
    const openMiniCart = !cart.eventOptions || cart.eventOptions.shouldOpenCart !== false;
    const allowInMobile =
      !this.m_isMobileView || this.experimentManager.isExperimentEnabled(Specs.AllowMobileTinyCartInViewer);

    // If not originated from views page
    if (!(cart.extraParams && cart.extraParams.origin === ORIGIN_CART) && allowInMobile && openMiniCart) {
      this.openDropdown();
    }
  }

  public getCartSectionId(): string | any {
    return {
      sectionId: this.pageMap.cart,
      queryParams: {origin: 'cart-popup'},
    };
  }

  public getFormattedComparePrice(item: ICartItemV2): string {
    if (item.convertedPrices) {
      return item.convertedPrices.formattedPriceBeforeDiscount || item.convertedPrices.formattedComparePrice;
    } else {
      return item.formattedPriceBeforeDiscount || item.formattedComparePrice;
    }
  }

  public getFormattedPrice(item: ICartItemV2): string {
    return item.convertedPrices ? item.convertedPrices.formattedPrice : item.formattedPrice;
  }

  public getSubTotal(): string {
    return this.cartData.convertedTotals.formattedItemsTotal;
  }

  public getItemDiscountNames(item: ICartItemV2): string[] {
    return (item?.discountRules ?? []).map(discount => discount.name);
  }

  public shouldShowSubtotal(): boolean {
    if (!this.cartData) {
      return false;
    }

    const itemsTotal = this.cartData.convertedTotals
      ? this.cartData.convertedTotals.itemsTotal
      : this.cartData.totals.itemsTotal;

    return itemsTotal > 0;
  }

  public updateCartItemQuantity(product: ICartItemV2, newQuantity: number): void {
    newQuantity = this.getQuantityInValidRange(product, +newQuantity);
    if (newQuantity === 0) {
      return;
    }

    const cartId = this.cartDataService.getCartId();
    const BIData = this.getCartBIData(product.productId);
    BIData.itemsCount += newQuantity - product.quantity;
    BIData.cartType = this.getCartType();
    this.wixBIAdapter.sendBIEvent(BIEventsList.UPDATE_QUANTITY, BIData);
    this.cartItemService.updateCartItemQuantity(product.cartItemId, newQuantity, cartId).then(c => {
      this.cartData = c.cartSummary;
      this.totalItemsQuantity = this.getTotalItemsQuantity();
    });
  }

  private getCartBIData(productId?) {
    const BIData: IBIData = {
      cartId: this.cartDataService.getCartId(),
      origin: 'shopping cart',
      catalogAppId: this.cartDataService.getCatalogAppIdForBi(),
    };
    if (productId) {
      BIData.productId = productId;
    }
    BIData.itemsCount = this.cartDataService.getTotalQuantity(this.cartData);
    return BIData;
  }

  public getCartType(): CartType {
    if (!this.cartData.itemsTypes || this.cartData.itemsTypes.length === 0) {
      return CartType.PHYSICAL;
    }
    const someItemType = this.cartData.itemsTypes[0];
    const isMixedCart = this.cartData.itemsTypes.some(itemType => itemType !== someItemType);

    if (isMixedCart) {
      return CartType.MIXED;
    } else if (someItemType === ProductType.DIGITAL) {
      return CartType.DIGITAL;
    } else {
      return CartType.PHYSICAL;
    }
  }

  public isProductInStock(item: ICartItemV2): boolean {
    return item.inventoryQuantity === null || item.inventoryQuantity > 0;
  }

  private getQuantityInValidRange(product, newQuantity: number): number {
    // product out of stock
    if (product.inventoryQuantity === 0) {
      return 0;
      // user left input empty or put 0
    } else if (newQuantity === undefined || newQuantity < 1) {
      return 1;
      // inventory is limited and new quantity is bigger than that
    } else if (product.inventoryQuantity !== null && product.inventoryQuantity < newQuantity) {
      return product.inventoryQuantity;
    } else if (newQuantity > this.maxQuantity) {
      return this.maxQuantity;
    } else {
      return newQuantity;
    }
  }

  public isAllowToAdd(item: ICartItemV2): boolean {
    if (item.inventoryQuantity !== null) {
      return item.inventoryQuantity > item.quantity;
    }
    return true;
  }

  public get popupCartType() {
    if (this.origin === Origin.AddToCartButton || this.origin === Origin.Velo) {
      if (this.m_isMobileView) {
        return PopupCartType.MOBILE;
      }

      return this.addToCartActionOption === AddToCartActionOption.TINY_CART
        ? PopupCartType.TINY_CART
        : PopupCartType.MINI_CART;
    }

    return PopupCartType.MINI_CART;
  }

  public get popupCartClass() {
    if (this.popupCartType === PopupCartType.TINY_CART || this.popupCartType === PopupCartType.MOBILE) {
      return 'tinycart';
    }
    return 'minicart';
  }

  private get popupCartTypeForBi() {
    switch (this.popupCartType) {
      case PopupCartType.MOBILE:
        return 'mobile';
      case PopupCartType.TINY_CART:
        return 'tiny-cart';
      case PopupCartType.MINI_CART:
      default:
        return 'mini-cart';
    }
  }

  public get popupCartItems() {
    if (this.popupCartType === PopupCartType.TINY_CART && this.addedProductId?.length > 0) {
      const addedItem = this.cartData.items.find((item: any) => item.id === this.addedProductId);
      return addedItem ? [addedItem] : [];
    }
    return this.cartData.items;
  }

  public get isTinyCartMode() {
    return this.popupCartType === PopupCartType.TINY_CART;
  }

  public get isMiniCartMode() {
    return this.popupCartType === PopupCartType.MINI_CART;
  }

  public get isMobileMode() {
    return this.popupCartType === PopupCartType.MOBILE;
  }

  public getTinyCartSubtotalMessage(): string {
    const totalItemsQuantity = this.totalItemsQuantity;
    const key = totalItemsQuantity > 1 ? 'cartPopUp.itemsSubtotal.plural' : 'cartPopUp.itemsSubtotal.singular';
    return this.$translate(key, {numOfItems: totalItemsQuantity});
  }

  private getTotalItemsQuantity(): number {
    return this.cartData.items.reduce((previousValue, currentValue) => {
      return previousValue + (currentValue.quantity || 0);
    }, 0);
  }

  public isLineItemClickable(product: ICartProduct): boolean {
    return product.urlPart === '';
  }
}

export const cartPopup: angular.IComponentOptions = {
  template,
  controller: CartPopupController,
  controllerAs: 'cartPopupVM',
};
