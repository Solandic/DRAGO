import { createClient, WixClient } from '@wix/sdk';
import { site } from '@wix/site';
import { WixCodeAPI } from '@wix/blocks-widget-services-types';
import { get, invoke } from 'lodash';
import { ClientSdk } from './IWidgetModuleProvider';

const createClientSdk = (wixSdk: WixCodeAPI) => {
  return {
    async invoke({
      applicationId,
      namespace,
      method,
      args,
    }: {
      applicationId: string;
      namespace: string;
      method: string;
      args: unknown[];
    }): Promise<any> {
      try {
        const targetValueOrMethodToInvoke = get(
          wixSdk,
          `${namespace}.${method}`,
        );

        if (typeof targetValueOrMethodToInvoke === 'function') {
          return invoke(wixSdk, `${namespace}.${method}`, ...args);
        }

        return targetValueOrMethodToInvoke;
      } catch (e: any) {
        console.error('Wix SDK- Failed to invoke method', {
          applicationId,
          namespace,
          method,
          message: e.message,
        });
      }
    },
  };
};

export function createSdkProviders(
  wixSdk: any,
  appDefinitionId: string,
  appInstance: string,
): {
  client: WixClient;
  clientSdk: ClientSdk;
} {
  const clientSdk = createClientSdk(wixSdk);

  const apiBaseUrl = getApiBaseUrl(wixSdk);

  const client = createClient({
    host: {
      ...site.host({ applicationId: appDefinitionId, clientSdk }),
      ...(apiBaseUrl !== undefined ? { apiBaseUrl } : {}),
      essentials: {
        language:
          wixSdk.window?.multilingual?.currentLanguage || wixSdk.site?.language,
        locale: wixSdk.window?.locale,
      },
    },
    auth: {
      getAuthHeaders() {
        /* istanbul ignore next */
        return {
          headers: {
            Authorization: appInstance.startsWith('OauthNG')
              ? appInstance
              : wixSdk.elementorySupport?.getRequestOptions().Authorization,
          },
        };
      },
    },
  });

  return { client, clientSdk };
}
export function getApiBaseUrl(wixSdk: WixCodeAPI) {
  if (wixSdk.window?.viewMode !== 'Site') {
    return undefined;
  }

  const siteBaseUrl = wixSdk.location?.baseUrl;
  const siteUrl = new URL(siteBaseUrl);
  return siteUrl.hostname;
}

export function getWixContext(
  wixSdk: WixCodeAPI,
  appDefinitionId: string,
  appInstance: string,
): {
  version: number;
  client: WixClient;
  clientSdk: ClientSdk;
} {
  const { client, clientSdk } = createSdkProviders(
    wixSdk,
    appDefinitionId,
    appInstance,
  );

  return {
    version: 3,
    client,
    clientSdk,
  };
}
