import {
  ControllerConfig,
  WixCodeAPI,
} from '@wix/blocks-widget-services-types';
import {
  StructureLightbox,
  StructurePage,
} from '@wix/native-components-infra/dist/src/types/types';
import { decodeInstance } from '@wix/ambassador-devcenter-iv-v1-instance/http';
import { META_SITE_APP_DEF_ID, WIX_APIS } from '../constants';

export type ApplicationNamespace = {
  getAppInstance: () => string;
  getDecodedAppInstance: () => Promise<Record<string, any> | null>;
  getAppPageUrl: (pageId: string) => Promise<string | null>;
  openAppLightbox: (lightboxId: string, data: any) => Promise<void>;
  getAccessToken: () => string;
};

type StructurePageWithHiddenFields = StructurePage & {
  applicationId: string;
  tpaPageId: string;
};

type StructureLightboxWithHiddenFields = StructureLightbox & {
  id: string;
  appDefinitionId: string;
  tpaPageId: string;
};

type SiteStructureWithHiddenFields = {
  pages: StructurePageWithHiddenFields[];
  lightboxes: StructureLightboxWithHiddenFields[];
};

const getSiteStructure = (
  wixCodeApi: WixCodeAPI,
): Promise<SiteStructureWithHiddenFields> => {
  return wixCodeApi.site.getSiteStructure({
    includePageId: true,
  }) as unknown as Promise<SiteStructureWithHiddenFields>;
};

const getLightboxPredicate =
  (appDefId: string, tpaPageId: string) =>
  (lightbox: StructureLightboxWithHiddenFields) => {
    return (
      lightbox.appDefinitionId === appDefId && lightbox.tpaPageId === tpaPageId
    );
  };

const getPagePredicate =
  (appDefId: string, tpaPageId: string) =>
  (page: StructurePageWithHiddenFields) => {
    return page.applicationId === appDefId && page.tpaPageId === tpaPageId;
  };

export const createApplicationNamespace = <T extends {}>(
  controllerConfig: ControllerConfig<T>,
): ApplicationNamespace => {
  const {
    appParams: { instance, appDefinitionId },
    essentials: { httpClient },
    wixCodeApi,
  } = controllerConfig;

  return {
    getAppInstance: () => {
      console.warn(
        'getAppInstance is deprecated, please use getAccessToken instead',
      );
      return instance;
    },
    getAccessToken: () => instance,
    getDecodedAppInstance: async () => {
      if (instance === 'preview-instance') {
        return Promise.resolve({
          appDefId: '00000000-0000-0000-0000-000000000000',
          instanceId: '00000000-0000-0000-0000-000000000000',
        });
      }

      if (instance.startsWith('OauthNG.')) {
        const oauth2TokenInfo = await httpClient.post<Record<string, any>>(
          '/oauth2/token-info',
          { token: instance },
          {
            baseURL: WIX_APIS,
          },
        );
        return {
          appDefId: oauth2TokenInfo.data.clientId,
          instanceId: oauth2TokenInfo.data.instanceId,
          vendorProductId: oauth2TokenInfo.data.vendorProductId,
        };
      }

      const baseURL =
        wixCodeApi.window.viewMode === 'Site'
          ? new URL(wixCodeApi.location.baseUrl).origin
          : undefined;

      // platformAPIs type doesnt match the actual impelentation
      const signedInstance = (
        controllerConfig.platformAPIs as any
      ).essentials.env.platformEnv.getAppToken(META_SITE_APP_DEF_ID);

      const { data } = await httpClient.request(
        (reqContext) => ({
          ...decodeInstance({ instance })(reqContext),
          baseURL,
        }),
        {
          signedInstance,
        },
      );

      return data.decodedInstance || null;
    },
    getAppPageUrl: async (pageId: string) => {
      const siteStructure = await getSiteStructure(wixCodeApi);
      const pagePredicate = getPagePredicate(appDefinitionId, pageId);
      const matchingPage = siteStructure.pages.find(pagePredicate);

      return matchingPage?.url || null;
    },
    openAppLightbox: async (lightboxId: string, data: any) => {
      const siteStructure = await getSiteStructure(wixCodeApi);
      const lightboxPredicate = getLightboxPredicate(
        appDefinitionId,
        lightboxId,
      );
      const matchingLightbox = siteStructure.lightboxes.find(lightboxPredicate);

      return (
        matchingLightbox &&
        wixCodeApi.window.openLightboxById(matchingLightbox.id, data)
      );
    },
  };
};
