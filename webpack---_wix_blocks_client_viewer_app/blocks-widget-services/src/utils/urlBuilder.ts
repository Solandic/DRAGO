import {
  AppParams,
  BlocksConfig,
  BlocksPreviewAppData,
  PanelConfig,
} from '@wix/blocks-widget-services-types';
import {
  IElementorySupport,
  IWixAPI,
} from '@wix/native-components-infra/dist/src/types/types';
import { NotBlocksPreviewAppError } from '../errors/notBlocksPreviewAppError';
import { NoWidgetCodeUrlError } from '../errors/noWidgetCodeUrlError';
import { PANEL_CODE_OVERRIDE } from '../constants';
import { isLocalhost } from './urlUtils';
import { generateCacheBuster } from '@wix/cloud-user-code-cache-buster-generator';

const BASE_DESCRIPTOR_URL =
  'https://wixmp-6f01a4ce0453f15410e74e05.wixmp.com/widget-descriptors';

export const generateWidgetCodeUrl = (
  widgetType: string,
  { code, metaSiteId }: BlocksConfig,
) => {
  const { instanceId, gridId, experimentsQueryString } = code;
  const baseUrl = new URL(
    `https://bundler.wix-code.com/${metaSiteId}/${instanceId}/${gridId}/pages/${widgetType}.js`,
  );

  const urlSearchParams = new URLSearchParams(experimentsQueryString);
  urlSearchParams.append('cache-buster', generateCacheBuster());
  baseUrl.search = urlSearchParams.toString();

  return baseUrl.toString();
};

export const getPropertyFromUrl = (url: string, propertyName: string) => {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(parsedUrl.search);
  return params.get(propertyName);
};

const isVersion = (value: string) => {
  const versionRegex = /^(\d+\.)?(\d+\.)?(\d+)$/;
  return versionRegex.test(value);
};

export const getOverrideByPanelPage = (
  panelOverride: string,
  panelPageId: string,
) => {
  const pageOverride = panelOverride
    .split(',')
    .map((x) => x.split('='))
    .find(([pageId]) => pageId === panelPageId);

  if (!pageOverride) {
    return;
  }

  const [, panelPageOverride] = pageOverride;
  return panelPageOverride;
};

export const getPanelScriptUrlFromPanelOverride = (
  config: PanelConfig,
  panelOverride: string,
) => {
  if (isLocalhost(panelOverride)) {
    return panelOverride;
  }

  if (isVersion(panelOverride)) {
    return getPanelCodeUrl(config, panelOverride);
  }

  return;
};

const getOverridenPanelUrl = ({
  wixCodeApi,
  config,
}: {
  wixCodeApi: IWixAPI;
  config: PanelConfig;
}) => {
  const panelOverride = getPropertyFromUrl(
    wixCodeApi.location.url,
    PANEL_CODE_OVERRIDE,
  );

  if (!panelOverride) {
    return;
  }

  let panelScriptUrl = getPanelScriptUrlFromPanelOverride(
    config,
    panelOverride,
  );
  if (panelScriptUrl) {
    return panelScriptUrl;
  }

  panelScriptUrl = getOverrideByPanelPage(panelOverride, config.type);
  if (!panelScriptUrl) {
    return;
  }

  return getPanelScriptUrlFromPanelOverride(config, panelScriptUrl);
};

export const generatePanelCodeUrl = ({
  wixCodeApi,
  config,
}: {
  wixCodeApi: IWixAPI;
  config: PanelConfig;
}) => {
  const overridenPanelUrl = getOverridenPanelUrl({ wixCodeApi, config });
  if (overridenPanelUrl) {
    console.info(`Loading overriden panel script from panelCodeOverride"`);
    return overridenPanelUrl;
  }

  const version = getPropertyFromUrl(wixCodeApi.location.url, 'version');
  if (!version) {
    return;
  }

  if (!isVersion(version)) {
    throw new Error(
      'Panel Version string does not conform to the version pattern',
    );
  }

  return getPanelCodeUrl(config, version);
};

const getPanelCodeUrl = (config: PanelConfig, version: string) => {
  const { artifactId, type } = config;
  if (!artifactId) {
    return;
  }

  return `https://static.parastorage.com/services/${artifactId}/${version}/panelScript.${type}.bundle.min.js`;
};

export const generateWidgetDescriptorUrl = (
  widgetType: string,
  { appDefinitionId, revision }: BlocksConfig,
) =>
  `${BASE_DESCRIPTOR_URL}/${appDefinitionId}/${widgetType}/${revision}/widgetDescriptor.json`;

/**
 * TODO: remove this once we get it from the app data
 */
declare global {
  interface WorkerGlobalScope {
    elementorySupport?: IElementorySupport;
  }
}

const generatePreviewUrlFromElementorySupport = (
  elementorySupport: IElementorySupport,
  widgetType: string,
) => {
  const { queryParameters, baseUrl } = elementorySupport;

  return `${baseUrl}/pages/${widgetType}.js?${queryParameters}`;
};

const generatePreviewUrlFromAppParams = (
  appParams: AppParams<BlocksPreviewAppData>,
  widgetType: string,
) => {
  const { widgetsCodeMap } = appParams?.appData?.blocksPreviewData || {};
  if (!widgetsCodeMap) {
    return null;
  }
  const widgetCodeDescriptor = widgetsCodeMap[widgetType];
  if (!widgetCodeDescriptor) {
    throw new NoWidgetCodeUrlError(widgetType);
  }
  return widgetCodeDescriptor.url;
};

export const generatePreviewWidgetCodeUrl = (
  widgetType: string,
  appParams: AppParams<BlocksPreviewAppData>,
): string => {
  const urlFromCodeMap = generatePreviewUrlFromAppParams(appParams, widgetType);
  if (urlFromCodeMap) {
    return urlFromCodeMap;
  }
  if (self.elementorySupport) {
    return generatePreviewUrlFromElementorySupport(
      self.elementorySupport!,
      widgetType,
    );
  }
  throw new NotBlocksPreviewAppError();
};
