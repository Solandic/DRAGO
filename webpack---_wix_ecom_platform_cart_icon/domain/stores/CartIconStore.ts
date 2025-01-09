import _ from 'lodash';
import {ProductType, CartType, Topology, PageMap, getLocaleNamespace} from '@wix/wixstores-client-core';
import {ICartItem, IDataResponse} from '../../types/cart';
import {
  SiteStore,
  CartActions,
  IEcomPlatformPublicApi,
  EcomPlatformViewerScriptContext,
} from '@wix/wixstores-client-storefront-sdk';
import {isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {ICartIconStyleParams, ICtrlProps} from '../../types/app-types';
import {ICart} from '@wix/wixstores-graphql-schema';
import {query as getAppSettingsData} from '../../graphql/getAppSettingsData.graphql';
import {IControllerConfig} from '@wix/native-components-infra/dist/es/src/types/types';
import {PubSubManager} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/PubSubManager/PubSubManager';
import {getCatalogAppId} from '../../utils/utils';
import {
  cartCartIconLoaded,
  cartClickOnCartIconToOpenMiniCart,
  clickToViewCartPage,
} from '@wix/bi-logger-ecom-platform-data/v2';
import {EMPTY_CART_GUID, FedopsInteraction, SPECS} from '../../constants';
import {ControllerParams} from '@wix/yoshi-flow-editor';

const iconsWithText = [3, 4, 5, 6, 7];

export class CartIconStore {
  private appSettingsPromise?: Promise<any>;
  private cart?: any;
  private cartPromise?: Promise<any>;
  private readonly cartActions: CartActions;
  private readonly pubSubManager: PubSubManager;
  private appSettings?: {[key: string]: any};
  private styleParams: ICartIconStyleParams;

  constructor(
    private readonly siteStore: SiteStore,
    private readonly config: IControllerConfig,
    private readonly setProps: (props: any) => void,
    private readonly reportError: (e: any) => any,
    private readonly translations: ControllerParams['flowAPI']['translations'],
    private readonly fedops: ControllerParams['flowAPI']['fedops'],
    private readonly panoramaClient: ControllerParams['flowAPI']['panoramaClient'],
    private readonly wixCodeApi: ControllerParams['flowAPI']['controllerConfig']['wixCodeApi'],
    private readonly currentCartService?: EcomPlatformViewerScriptContext['currentCartService']
  ) {
    this.pubSubManager = new PubSubManager(this.siteStore.pubSub);
    this.wixCodeApi = wixCodeApi;
    this.cartActions = this.siteStore.experiments.enabled(SPECS.UseNavigateToCartFromCurrentCartService)
      ? this.currentCartService!.cartActions
      : new CartActions({
          siteStore: this.siteStore,
          origin: 'cart-icon',
        });
    this.styleParams = this.config.style.styleParams;

    const moveMiniCartInitialization = this.siteStore.experiments.enabled(SPECS.MoveMiniCartInitialization);
    if (
      !moveMiniCartInitialization &&
      !this.siteStore.isMobile() &&
      (this.siteStore.isSiteMode() || this.siteStore.isPreviewMode())
    ) {
      setTimeout(this.initPopup, 0);
    }

    this.currentCartService!.onChange(() => {
      this.onUpdated();
    });
  }

  private onUpdated() {
    void this.currentCartService!.getCurrentCartGQL().then((cart) => {
      this.updateCart(cart as ICart);
      if (!this.siteStore.experiments.enabled(SPECS.MoveMiniCartInitialization)) {
        this.sendMiniCartInitData(cart as ICart);
      }
    });
  }

  private sendMiniCartInitData(cart: ICart) {
    this.siteStore.pubSubManager.publish('Minicart.OnInitialData', cart);
  }

  public updateCart(cart: ICart): void {
    this.cart = cart;

    const count = this.getTotalQuantity(this.cart.items);
    this.setProps({
      ...this.getCountRelatedProps(count),
    });
  }

  public async init(): Promise<void> {
    const cartPromise = this.siteStore.isSSR() ? undefined : this.getData();

    const isMultilingualNonPrimary = () => {
      const multiLangFields = this.siteStore.getMultiLangFields();
      return !!multiLangFields && !multiLangFields.isPrimaryLanguage;
    };

    const shouldFetchAppSettingsML = isMultilingualNonPrimary();

    const shouldFetchAppSettingsNeededIcon = iconsWithText.includes(this.styleParams.numbers.cartWidgetIcon || 1);

    const shouldFetchAppSettingsExternalIdDefined = !!this.config.externalId;

    const appSettingsPromise =
      shouldFetchAppSettingsML && shouldFetchAppSettingsNeededIcon && shouldFetchAppSettingsExternalIdDefined
        ? this.getAppSettingsData()
        : undefined;

    const isCartIconCssVarsCssOptimizationEnabled = this.siteStore.experiments.enabled(
      SPECS.CartIconCssVarsCssOptimization
    );

    return Promise.all([appSettingsPromise, this.siteStore.getSectionUrl(PageMap.CART)])
      .then(([serverResponse, cartLink]) => {
        this.cart = serverResponse?.cartSummary || {};
        const count = this.cart.items ? this.getTotalQuantity(this.cart.items) : undefined;

        const props = {
          ...this.getCountRelatedProps(count),
          cartLink: _.get(cartLink, 'url', ''),
          fitToContentHeight: true,
          isInteractive: this.siteStore.isInteractive(),
          isLoaded: true,
          displayText: this.getDisplayText(serverResponse?.widgetSettings),
          triggerFocus: false,
          onFocusTriggered: this.onFocusTriggered,
          isNavigate: !this.shouldOpenMinicartFromSettings(),
          onIconClick: this.onIconClick,
          onAppLoaded: this.onAppLoaded,
          ravenUserContextOverrides: {
            id: this.siteStore.storeId,
            uuid: this.siteStore.uuid,
          },
          removeHrefFromCartIconOnSsr: this.siteStore.experiments.enabled(SPECS.RemoveHrefFromCartIconOnSsr),
          isCartIconCssVarsCssOptimizationEnabled,
        } as ICtrlProps;
        this.setProps(props);

        cartPromise
          ?.then(({cartSummary}) => {
            this.cart = cartSummary;
            const count = this.cart.items ? this.getTotalQuantity(this.cart.items) : 0;
            this.fedops.interactionEnded(FedopsInteraction.CART_ICON_LOADED);
            this.setProps({
              ...this.getCountRelatedProps(count),
            });
          })
          .catch((e) => this.reportError(e));
      })
      .catch((e) => this.reportError(e));
  }

  public onFocusTriggered = (): void => {
    this.setProps({
      triggerFocus: false,
    });
  };

  public onAppLoaded = (): void => {
    if (!isWorker() || this.siteStore.isInteractive()) {
      const shouldReport = this.siteStore.storage.memory.getItem('cartIconLoaded');
      if (!shouldReport) {
        this.siteStore.storage.memory.setItem('cartIconLoaded', 'true');
        this.reportCartIconLoaded();
      }
    }
  };

  private readonly reportCartIconLoaded = (): void => {
    const baseBiParams = {
      isMobileFriendly: this.siteStore.isMobileFriendly,
      navigationClick: this.shouldOpenMinicartFromSettings() ? 'mini cart' : 'cart',
    };

    void this.siteStore.webBiLogger.report(
      cartCartIconLoaded({
        ...baseBiParams,
        catalogAppId: getCatalogAppId(this.cart?.items || []),
      })
    );
  };

  public getDisplayText(widgetSettings?: {[key: string]: string}): string {
    const defaultValue = this.translations.t(`CART_ICON_${this.styleParams.numbers.cartWidgetIcon || 1}`);
    let widgetSettingsForLocale = {};
    const multiLangFields = this.siteStore.getMultiLangFields();
    if (multiLangFields && !multiLangFields.isPrimaryLanguage) {
      if (widgetSettings) {
        widgetSettingsForLocale = widgetSettings[getLocaleNamespace(multiLangFields.lang)];
        return _.get(widgetSettingsForLocale, 'CART_ICON_TEXT', '') || defaultValue;
      } else if (this.appSettings) {
        widgetSettingsForLocale = this.appSettings[getLocaleNamespace(multiLangFields.lang)];
        return _.get(widgetSettingsForLocale, 'CART_ICON_TEXT', '') || defaultValue;
      } else {
        return defaultValue;
      }
    }
    return (
      _.get(this.appSettings, 'main.CART_ICON_TEXT', '') ||
      _.get(this.config, 'publicData.APP.CART_ICON_TEXT', '') ||
      defaultValue
    );
  }

  public updateStyleParams(newStyleParams: ICartIconStyleParams) {
    this.styleParams = newStyleParams;
    this.setProps({
      displayText: this.getDisplayText(),
    });
  }

  public updateAppSettings(appSettings: {[key: string]: any}) {
    this.appSettings = appSettings;
    this.setProps({
      displayText: this.getDisplayText(),
    });
  }

  public async getData(): Promise<IDataResponse> {
    this.cartPromise = this.currentCartService!.getCurrentCartGQL().then((cartSummary) => ({cartSummary}));

    return this.cartPromise;
  }

  public async getAppSettingsData(): Promise<IDataResponse> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (this.appSettingsPromise) {
      return this.appSettingsPromise;
    }

    const postData = {
      query: getAppSettingsData,
      source: 'WixStoresWebClient',
      operationName: 'getAppSettings',
      variables: {externalId: this.config.externalId || ''},
    };

    this.appSettingsPromise = this.siteStore
      .tryGetGqlAndFallbackToPost(this.siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`), postData)
      .then(({data}) => {
        return {
          widgetSettings: _.get(data, 'appSettings.widgetSettings', {}),
        };
      });

    return this.appSettingsPromise;
  }

  public shouldOpenMinicartFromSettings(): boolean {
    const {iconLink} = this.styleParams.numbers;
    return !iconLink || iconLink === 2;
  }

  private readonly handleNavigateToCart = async (partialBi: object) => {
    const origin = 'cart-icon';

    void this.siteStore.webBiLogger.report(
      clickToViewCartPage({
        ...partialBi,
        origin,
        isNavigateCart: true,
        catalogAppId: getCatalogAppId(this.cart?.items),
        checkoutId: this.cart?.checkoutId,
      })
    );

    if (this.siteStore.experiments.enabled(SPECS.StopUsingCartActionInCartIcon)) {
      await this.siteStore.navigate(
        {
          sectionId: PageMap.CART,
          queryParams: {origin},
        },
        true
      );
    } else {
      await this.cartActions.navigateToCart(origin);
    }
  };

  private readonly subscribeToMiniCartCloseEvent = () => {
    const eventId = this.pubSubManager.subscribe('Minicart.DidClose', () => {
      this.setProps({
        triggerFocus: true,
      });
      this.pubSubManager.unsubscribe('Minicart.DidClose', eventId);
    });
  };
  public onIconClick = async (): Promise<void> => {
    if (!this.cart.cartId) {
      this.cart = (await this.cartPromise).cartSummary;
    }
    const cartId = this.cart.cartId === EMPTY_CART_GUID ? undefined : this.cart.cartId;
    const partialBi = {
      cartId,
      cartType: this.getCartType(),
      itemsCount: this.getTotalQuantity(this.cart.items),
      viewMode: this.siteStore.viewMode.toLowerCase(),
    };
    if (this.shouldOpenMinicartFromSettings()) {
      const api: IEcomPlatformPublicApi = await this.wixCodeApi.site.getPublicAPI(
        '1380b703-ce81-ff05-f115-39571d94dfcd'
      );

      try {
        await Promise.resolve(api.cart.showMinicart());
      } catch (err) {
        await this.handleNavigateToCart(partialBi);
        return;
      }

      void this.siteStore.webBiLogger.report(
        cartClickOnCartIconToOpenMiniCart({
          ...partialBi,
          isNavigateCart: false,
          catalogAppId: getCatalogAppId(this.cart?.items),
        })
      );

      if (!(await api.cart.hasSideCart())) {
        this.subscribeToMiniCartCloseEvent();
      }
    } else {
      await this.handleNavigateToCart(partialBi);
    }
  };

  public listenLoadedMinicartPopupAndSendCart(): void {
    this.pubSubManager.subscribe(
      'Minicart.LoadedWithoutData',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      () =>
        this.getData().then((cart) => {
          this.sendMiniCartInitData(cart.cartSummary);
          this.cart = cart.cartSummary;
        }),
      true
    );
  }

  public initPopup = (): void => {
    this.listenLoadedMinicartPopupAndSendCart();
  };

  public unSubscribeAll(): void {
    return this.pubSubManager.unsubscribeAll();
  }

  private getCartType() {
    const hasDigital = this.cart.items.some((item: any) => item.productType === ProductType.DIGITAL);
    const hasPhysical = this.cart.items.some(
      (item: any) => !item.productType || item.productType === ProductType.PHYSICAL
    );
    const hasService = this.cart.items.some((item: any) => item.productType === ProductType.SERVICE);
    const hasGiftCard = this.cart.items.some((item: any) => item.productType === ProductType.GIFT_CARD);
    const hasMultiVerticalItems = (hasDigital || hasPhysical) && (hasService || hasGiftCard);

    if (hasMultiVerticalItems) {
      return CartType.MIXED_VERTICALS;
    }

    if (hasDigital && hasPhysical) {
      return CartType.MIXED;
    } else if (hasDigital) {
      return CartType.DIGITAL;
    } else if (hasPhysical) {
      return CartType.PHYSICAL;
    } else if (hasService) {
      return CartType.SERVICE;
    } else if (hasGiftCard) {
      return CartType.GIFT_CARD;
    } else {
      return CartType.UNRECOGNISED;
    }
  }

  private getTotalQuantity(cartItems: ICartItem[] = []): number {
    return cartItems.reduce((previousValue, currentValue) => {
      return previousValue + (currentValue.quantity || 0);
    }, 0);
  }

  private getCountRelatedProps(count: number | undefined) {
    return {
      count,
      ariaLabelLink: this.translations.t('sr.CART_WIDGET_BUTTON_TEXT', {itemsCount: count}),
    };
  }

  public async executeWithFedops(interaction: FedopsInteraction, fn: () => Promise<any>): Promise<void> {
    this.fedops.interactionStarted(interaction);
    this.panoramaClient?.transaction(interaction).start();
    await fn();
    this.fedops.interactionEnded(interaction);
    this.panoramaClient?.transaction(interaction).finish();
  }
}
