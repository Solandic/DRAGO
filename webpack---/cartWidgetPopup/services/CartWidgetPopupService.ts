import {CartDataService} from '../../common/services/CartDataService';
import {SdkEvents} from '@wix/wix-ecommerce-common-storefront/dist/src/services/sdkEvents';
import {ICartStorage} from '@wix/wix-ecommerce-common-storefront/dist/src/typings/ICartStorage';
import {ICartV2} from '@wix/wix-ecommerce-common-storefront/dist/src/typings/cartDef';
import {SdkAdapter} from '@wix/ecommerce-sf-sm-common/dist/src/common/services/sdkAdapter';
import {GUIDGeneratorService} from '@wix/ecommerce-sf-sm-common/dist/src/common/services/GUIDGeneratorService';

export class CartWidgetPopupService {
  private readonly popupId: string;

  /* @ngInject */
  constructor(
    private readonly sdkEvents: SdkEvents,
    private readonly sdkAdapter: SdkAdapter,
		private GUIDGeneratorService: GUIDGeneratorService,// tslint:disable-line
    private readonly $q: ng.IQService,
    private readonly cartDataService: CartDataService,
    private readonly cartStorage: ICartStorage
  ) {
    this.popupId = this.GUIDGeneratorService.generate();
  }

  /**
   * Load cart data into popup from 3rd party component.
   * 3rd party component has to listen to `Minicart.LoadedWithoutData` and then
   * send the data with `Minicart.OnInitialData` event.
   * @returns {IPromise<ICartV2>}
   */
  public loadCart(): ng.IPromise<ICartV2> {
    return new this.$q(resolve => {
      this.sdkEvents.on('Minicart.OnInitialData', cart => {
        this.cartDataService.saveLocalData(cart);
        // keep the reference alive!
        resolve(this.cartStorage.cartData);
      });
      this.notifyPopupLoadedWithoutData();
    });
  }

  /**
   * Subscribe the component to close itself when other popup
   * sends the event `Minicart.Close`.
   */
  public subscribeCloseThisPopupWhenOtherPopupsAskFor(): void {
    this.sdkEvents.on('Minicart.Close', popupId => {
      if (popupId !== this.popupId) {
        this.sdkAdapter.closeWindow(null);
      }
    });
  }

  public closeOtherPopups(): void {
    this.sdkEvents.broadcast('Minicart.Close', this.popupId);
  }

  private notifyPopupLoadedWithoutData(): void {
    this.sdkEvents.broadcastPersistent('Minicart.LoadedWithoutData', null);
  }
}
