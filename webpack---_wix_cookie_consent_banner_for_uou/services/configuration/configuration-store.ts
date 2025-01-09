import {
  ConsentPolicy,
  DEFAULT_POLICY,
  CookieBannerSettings,
} from '../../types';
import { getConsentPolicy } from '../consent-policy-manager/consent-policy-manager';
import { TranslationsMap } from '../i18n/translate';
import { componentSettingsService } from '../component-settings/component-settings-service';
import { getInitialSettings } from './get-initial-settings';
import { translationKeys } from '../../constants/constants';
import { experiments } from '../experiments/experiments';

const storeListeners: IStoreChangedFunction[] = [];

export interface ConfigData {
  titleKey: string;
  descriptionKey: string;
  toggleEnabled: boolean;
  toggleTooltip?: string;
  policyKeys: string[];
}

export interface IStoreActions {
  addStoreListener(callback: Function): void;
}

export type IStoreChangedFunction = (newStore: IStore) => {};

export interface IStore {
  configuration: ConfigData[];
  consentPolicy: ConsentPolicy;
  translations: TranslationsMap;
  settings: CookieBannerSettings;
  policySubmitted: boolean;
  createdPolicyTimestamp?: Date;
  getAccessToken?: () => Promise<string>;
}

let store: IStore = {
  policySubmitted: false,
  configuration: [
    {
      titleKey: translationKeys.advancedCategoryEssentialHeadline,
      descriptionKey: translationKeys.advancedCategoryEssentialParagraph,
      toggleEnabled: false,
      toggleTooltip: translationKeys.essentialTooltip,
      policyKeys: ['essential'],
    },
    {
      titleKey: translationKeys.advancedCategoryMarketingHeadline,
      descriptionKey: translationKeys.advancedCategoryMarketingParagraph,
      toggleEnabled: true,
      policyKeys: ['advertising'],
    },
    {
      titleKey: translationKeys.advancedCategoryFunctionalHeadline,
      descriptionKey: translationKeys.advancedCategoryFunctionalParagraph,
      toggleEnabled: true,
      policyKeys: ['functional'],
    },
    {
      titleKey: translationKeys.advancedCategoryAnalyticsHeadline,
      descriptionKey: translationKeys.advancedCategoryAnalyticsParagraph,
      toggleEnabled: true,
      policyKeys: ['analytics'],
    },
  ],
  translations: {},
  settings: getInitialSettings(),
  consentPolicy: DEFAULT_POLICY,
};

export const initStore = async (
  defaultStore: {
    preview: boolean;
    getAccessToken?: () => Promise<string>;
  } = { preview: false },
): Promise<IStore & IStoreActions> => {
  const policyDetails = await getConsentPolicy();
  store = {
    ...store,
    policySubmitted: !policyDetails.defaultPolicy,
    consentPolicy: { ...DEFAULT_POLICY, ...policyDetails.policy },
    createdPolicyTimestamp: policyDetails.createdDate,
    getAccessToken: defaultStore.getAccessToken,
  };

  let loadedTranslations = false;
  if (experiments.enabled('specs.cookieConsent.CcpML_MigrationUoU')) {
    try {
      const { settings, translations } =
        await componentSettingsService.getSettingsAndTranslations(
          defaultStore.preview,
        );
      store = {
        ...store,
        settings,
        translations,
      };
      loadedTranslations = true;
    } catch (e) {
      console.error('banner-uou: Failed to load translations');
      console.error('banner-uou', e);
    }
  }

  if (!loadedTranslations) {
    const settings = await componentSettingsService.getSettings();
    const translations = await componentSettingsService.getTranslations();
    store = {
      ...store,
      settings,
      translations,
    };
  }
  return getStore();
};

export const updateStore = (storeUpdate: Partial<IStore>) => {
  store = {
    ...store,
    ...storeUpdate,
  };
  storeListeners.forEach((func) => func(store));
};

const addStoreListener = (callback: IStoreChangedFunction) => {
  storeListeners.push(callback);
};

export const getStore = (): IStore & IStoreActions => {
  return {
    ...store,
    addStoreListener,
  };
};
