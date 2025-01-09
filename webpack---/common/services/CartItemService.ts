import {CartDataService} from './CartDataService';
import {ICartResponseV2} from '@wix/wix-ecommerce-common-storefront/dist/src/typings/cartDef';
import {ICartApi} from '@wix/wix-ecommerce-common-storefront/dist/src/typings/servicesApi';

export class CartItemService {
  /* @ngInject */
  constructor(private readonly cartApi: ICartApi, private readonly cartDataService: CartDataService) {}

  public removeItemFromCart(cartItemId: string, cartId: string): ng.IPromise<ICartResponseV2> {
    return this.cartApi.removeCartItem(cartItemId, cartId).then(cartData => {
      if (cartData.cartSummary !== null && cartData.errors && cartData.errors.length === 0) {
        this.cartDataService.setData(cartData.cartSummary);
      }
      return cartData;
    });
  }

  public updateCartItemQuantity(cartItemId: string, quantity: number, cartId: string): ng.IPromise<ICartResponseV2> {
    return this.cartApi.updateCartItemQuantity(cartItemId, quantity, cartId).then(cartData => {
      if (cartData.cartSummary !== null && cartData.errors && cartData.errors.length === 0) {
        this.cartDataService.setData(cartData.cartSummary);
      }
      return cartData;
    });
  }
}
