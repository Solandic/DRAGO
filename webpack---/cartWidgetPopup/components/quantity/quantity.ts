import {CartDataService} from '../../../common/services/CartDataService';
import {CartItemService} from '../../../common/services/CartItemService';
import * as angular from 'angular';
import * as template from './quantity.html';
import {ICartItemV2, ICartV2} from '@wix/wix-ecommerce-common-storefront/dist/src/typings/cartDef';
import {IBIData} from '../../../typings/appConfig';
import {BIEventsList} from '../../../common/constants/biEventsList';
import {CartType} from '@wix/wix-ecommerce-common-storefront/dist/src/enums/cart';
require('ts-global-module-loader!angular-debounce');

export class QuantityController {
  private readonly maxQuantity: number = 99999;

  private readonly item: ICartItemV2;
  private readonly cartType: CartType;
  private readonly totalItemsQuantity: number;
  private readonly setCartData: (cartData: {cartSummary: ICartV2}) => void;

  /* @ngInject */
  constructor(
    private readonly $scope: ng.IScope,
    private readonly wixBIAdapter,
    private readonly cartDataService: CartDataService,
    private readonly cartItemService: CartItemService,
    debounce
  ) {
    this.updateQuantityInServer = debounce(this.updateQuantityInServer.bind(this), 300);
  }

  private updateQuantityInServer(newQuantity: number): void {
    this.sendUpdateQuantityBI(newQuantity);
    const cartId = this.cartDataService.getCartId();
    this.cartItemService.updateCartItemQuantity(this.item.cartItemId, newQuantity, cartId).then(({cartSummary}) => {
      this.setCartData({cartSummary});
    });
  }

  public updateCartItemQuantity(newQuantity: number): void {
    newQuantity = this.getQuantityInValidRange(this.item, +newQuantity);
    if (newQuantity === 0) {
      return;
    }
    this.item.quantity = newQuantity;
    this.updateQuantityInServer(newQuantity);
  }

  private sendUpdateQuantityBI(newQuantity: number): void {
    const BIData = this.getCartBIData(this.item.productId);
    BIData.itemsCount += newQuantity - this.item.quantity;
    BIData.cartType = this.cartType;
    this.wixBIAdapter.sendBIEvent(BIEventsList.UPDATE_QUANTITY, BIData);
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
    BIData.itemsCount = this.totalItemsQuantity;
    return BIData;
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
}

export const quantityComponent: angular.IComponentOptions = {
  template,
  bindings: {
    item: '=',
    cartType: '@',
    totalItemsQuantity: '=',
    setCartData: '&',
  },
  controller: QuantityController,
  controllerAs: 'quantityVM',
};
