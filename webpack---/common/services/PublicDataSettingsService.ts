import {SdkEvents} from '@wix/wix-ecommerce-common-storefront/dist/src/services/sdkEvents';
import * as angular from 'angular';
import {BaseSettingsService} from '@wix/wix-ecommerce-common-storefront/dist/src/services/BaseSettingsService';
import {siteEventTypeEnum} from '@wix/wix-ecommerce-common-storefront/dist/src/enums/siteEvent';
import {SdkSettings} from '@wix/wix-ecommerce-common-storefront/dist/src/services/sdkSettings';
import {ITextSettingsModel} from '../../typings/appConfig';
import {ISdkAdapter} from '@wix/ecommerce-sf-sm-common/dist/src/typings/ISdkAdapter';
import {ScopeType, SettingsManager} from '@wix/wix-ecommerce-common-storefront/dist/src/services/settingsManager';

const FreeText = {
  MINI_CART_FIRST_TIME_ADDED_TO_CART: 'MINI_CART_FIRST_TIME_ADDED_TO_CART' as string,
  MINI_CART_EMPTY_CART: 'MINI_CART_EMPTY_CART' as string,
  MINI_CART_BUTTON_TEXT: 'MINI_CART_BUTTON_TEXT' as string,
  MINI_CART_HEADER_TEXT: 'MINI_CART_HEADER_TEXT' as string,
};

export class PublicDataSettingsService extends BaseSettingsService<ITextSettingsModel> {
  public settings: ITextSettingsModel = {} as any;
  private settingsLoadedPromise;
  public cartFreeTextKeys = [] as any;
  public cartFreeTextValues = {} as any;

  /* @ngInject */
  constructor(
    public sdkAdapter: ISdkAdapter,
    sdkSettings: SdkSettings,
    public sdkEvents: SdkEvents,
    $q: ng.IQService,
    $timeout: ng.ITimeoutService,
    private readonly $rootScope: ng.IScope,
    private readonly settingsManager: SettingsManager
  ) {
    super(sdkSettings, sdkEvents, $q, $timeout);
    for (const key in FreeText) {
      if (FreeText[key]) {
        this.cartFreeTextKeys.push(FreeText[key]);
      }
    }
    this.handleTextSettings({textChanged: false});
    if (sdkAdapter.isEditMode()) {
      this.listenToIconTextChangeEvent();
      this.settingsManager.onAppSettingsChange(({texts}) => {
        this.setFreeTexts(texts, true);
      });
    }
  }

  private setFreeTexts(freeTexts: {}, shouldUpdateThatTextChanged = false) {
    for (const key in FreeText) {
      this.cartFreeTextValues[key] = freeTexts[key];
    }

    if (shouldUpdateThatTextChanged) {
      this.handleSettings(this.convertSettings(), {
        textChanged: shouldUpdateThatTextChanged,
      });
    }
  }

  public listenToIconTextChangeEvent(): void {
    this.sdkEvents.onSiteEvent(siteEventTypeEnum.SETTINGS_UPDATED, () => this.handleTextSettings({textChanged: true}));
  }

  public whenLoaded(): angular.IPromise<any> {
    return this.settingsLoadedPromise;
  }

  protected convertSettings(): ITextSettingsModel {
    return this.cartFreeTextValues;
  }

  private handleSettings(settings: ITextSettingsModel, state): void {
    angular.copy(settings, this.settings);
    if (state.textChanged) {
      this.$rootScope.$emit('ecom.iconChanged', {});
    }
  }

  private handleTextSettings(state): void {
    this.cartFreeTextValues = {};
    this.settingsLoadedPromise = this.settingsManager
      .getSettingsTexts({
        translatableKeys: this.cartFreeTextKeys,
        scope: ScopeType.APP,
      })
      .then(freeTexts => this.setFreeTexts(freeTexts))
      .then(() => this.getSettings().then(settings => this.handleSettings(settings, state)));
  }
}
