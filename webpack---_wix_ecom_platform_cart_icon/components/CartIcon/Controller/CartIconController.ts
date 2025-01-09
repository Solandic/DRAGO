import {ControllerParams} from '@wix/yoshi-flow-editor';
import {IWidgetControllerConfig} from '@wix/native-components-infra';
import {BaseController, createCartExports, EcomPlatformViewerScriptContext} from '@wix/wixstores-client-storefront-sdk';
import {IAddToCartOptions} from '../../../types/product';
import {FedopsInteraction, origin, SPECS} from '../../../constants';
import {IAddToCartItem} from '@wix/wixstores-client-core';
import {Scope} from '@wix/app-settings-client/dist/src/domain';
import {CartIconStore} from '../../../domain/stores/CartIconStore';
import {ICartIconStyleParams} from '../../../types/app-types';

export class CartIconController extends BaseController {
  protected cartIconStore!: CartIconStore;
  protected controllerConfig!: IWidgetControllerConfig;
  protected addToCart: any;
  protected addProducts: any;
  protected currentCartService!: EcomPlatformViewerScriptContext['currentCartService'];
  constructor(controllerParams: ControllerParams) {
    super(controllerParams);
    this.flowAPI.fedops.interactionStarted(FedopsInteraction.CART_ICON_LOADED);
    this.setStoresAndCreateCartExports(controllerParams);
    this.controllerConfig = controllerParams.controllerConfig;
  }

  private setStoresAndCreateCartExports({controllerConfig, flowAPI, appData}: ControllerParams) {
    this.currentCartService = appData?.context.currentCartService;
    this.cartIconStore = new CartIconStore(
      this.siteStore,
      controllerConfig.config,
      controllerConfig.setProps,
      flowAPI.reportError,
      flowAPI.translations,
      flowAPI.fedops,
      flowAPI.panoramaClient,
      controllerConfig.wixCodeApi,
      this.currentCartService
    );
    if (
      this.siteStore.experiments.enabled(SPECS.NavigateToCartWhenDontShowSideCartOnMobile) &&
      this.siteStore.isMobile() &&
      controllerConfig.config.publicData?.APP?.DONT_SHOW_SIDE_CART_ON_MOBILE
    ) {
      this.siteStore.dontShowSideCartOnMobile = true;
    }
    const {addToCart, addProducts} = createCartExports({
      context: {
        siteStore: this.siteStore,
        currentCartService: this.currentCartService,
        controllerConfigs: [controllerConfig],
      },
      origin,
    });
    this.addToCart = addToCart;
    this.addProducts = addProducts;
  }

  public readonly load = async () => {
    await this.cartIconStore.init();
  };

  public readonly init = async (): Promise<void> => {
    await this.load();
  };

  public onStyleUpdate = (newStyleParams: ICartIconStyleParams) => {
    this.cartIconStore.updateStyleParams(newStyleParams);
  };

  public readonly onAppSettingsUpdate = (updates: {[key: string]: any}) => {
    if (updates.scope === Scope.COMPONENT && updates.source === 'app-settings') {
      this.cartIconStore.updateAppSettings(updates.payload);
    } else if (updates.details) {
      this.cartIconStore.updateAppSettings({main: updates.details});
    }
  };

  public readonly onBeforeUnLoad = () => {
    this.cartIconStore.unSubscribeAll();
  };

  public readonly exports = () => {
    return {
      addToCart: async (productId: string, quantity: number = 1, options: IAddToCartOptions = {}): Promise<boolean> => {
        await this.cartIconStore.executeWithFedops(FedopsInteraction.ADD_TO_CART, () =>
          this.addToCart(productId, quantity, options)
        );
        return true;
      },
      addProductsToCart: async (cartItems: IAddToCartItem[]): Promise<boolean> => {
        await this.cartIconStore.executeWithFedops(FedopsInteraction.ADD_ITEMS_TO_CART, () =>
          this.addProducts(cartItems)
        );
        return true;
      },
    };
  };

  public getFreeTexts(): string[] {
    return [];
  }
}
