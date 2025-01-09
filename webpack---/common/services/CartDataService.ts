import {ORIGIN_CART} from '../data';
import {SdkEvents} from '@wix/wix-ecommerce-common-storefront/dist/src/services/sdkEvents';
import {ICartStorage} from '@wix/wix-ecommerce-common-storefront/dist/src/typings/ICartStorage';
import {ICartV2} from '@wix/wix-ecommerce-common-storefront/dist/src/typings/cartDef';

export class CartDataService {
  public hasOutOfStock: boolean;

  /* @ngInject */
  constructor(
    private readonly $rootScope: ng.IRootScopeService,
    private readonly clientConfig,
    private readonly cartStorage: ICartStorage,
    sdkEvents: SdkEvents
  ) {
    // Register cart change event
    sdkEvents.on('Cart.Changed', (newCart: ICartV2) => {
      const oldCart = JSON.parse(JSON.stringify(this.cartStorage.cartData));
      this.saveLocalData(newCart);
      this.$rootScope.$broadcast('Cart.Changed', {oldCart, newCart});
    });

    // Register cart clear after checkout event
    sdkEvents.on('Cart.Cleared', res => {
      if (res.cartId === this.cartStorage.getCartId()) {
        this.saveLocalData(this.getEmptyCart());
      }
    });

    sdkEvents.on('Cart.Loaded', cart => {
      this.saveLocalData(cart);
    });
  }

  public setData(newCart: ICartV2): void {
    this.saveLocalData(newCart);
    // Save cart also broadcast a cart changed event
    this.cartStorage.saveCart(newCart, ORIGIN_CART);
  }

  public saveLocalData(newCart: ICartV2): void {
    this.hasOutOfStock = this.isContainOutOfStock(newCart);
    this.cartStorage.saveCartDataLocally(newCart);
  }

  public getEmptyCart(): ICartV2 {
    return {
      storeId: this.clientConfig.storeId,
      items: [],
      itemsTypes: [],
      totals: {
        total: '0',
        itemsCount: '0',
        itemsTotal: 0,
        subTotal: 0,
        formattedSubTotal: '0',
        formattedItemsTotal: '0',
      },
      convertedTotals: {
        total: '0',
        itemsCount: '0',
        itemsTotal: 0,
        subTotal: 0,
        formattedSubTotal: '0',
        formattedItemsTotal: '0',
      },
    };
  }

  public getTotalQuantity(cartData: ICartV2): number {
    let total = 0;

    if (cartData && cartData.items) {
      total = cartData.items.reduce((previousValue: number, currentValue: any) => {
        return previousValue + parseInt(currentValue.quantity, 10) || 0;
      }, 0);
    }
    return total;
  }

  public getCartId(): string {
    return this.cartStorage.getCartId();
  }

  public getCatalogAppIdForBi(): string {
    return (
      this.cartStorage?.cartData?.items
        ?.map(({catalogAppId}) => catalogAppId)
        .filter((catalogAppId, index, self) => !!catalogAppId && self.indexOf(catalogAppId) === index)
        .toString() ?? ''
    );
  }

  private isContainOutOfStock(cart): boolean {
    if (!cart) {
      return false;
    }

    return cart.items.some((item: any) => {
      return !(item.inventoryQuantity === null || item.inventoryQuantity > 0);
    });
  }
}
