import {
  AppParams,
  BlocksAppParams,
  BlocksConfig,
  BlocksPreviewAppParams,
  ControllerConfig,
  RequiredKeys,
  WidgetConfig,
  WidgetControllerConfig,
} from '@wix/blocks-widget-services-types';
import { NotBlocksAppError } from '../errors/notBlocksAppError';
import { extractSearchParams } from './stringUtils';
import type {
  GetAppSnapshotResponse,
  Component,
  StudioComponentData,
} from '@wix/ambassador-app-service-webapp/types';

export const parseBaseUrlsData = (baseUrls: Record<string, string>) => {
  const urlParamsStr = extractSearchParams(baseUrls.siteAssets);
  const urlParams = new URLSearchParams(urlParamsStr);

  return {
    siteId: urlParams.get('siteId')!,
    metaSiteId: urlParams.get('metaSiteId')!,
    revision: urlParams.get('siteRevision')!,
  };
};

export const isBlocksAppParams = (
  appParams: AppParams,
): appParams is BlocksAppParams =>
  Boolean(appParams.baseUrls.siteAssets) && 'blocksData' in appParams;

export const isBlocksPreviewAppParams = (
  appParams: AppParams,
): appParams is RequiredKeys<BlocksPreviewAppParams, 'appData'> =>
  Boolean(appParams.appData && 'blocksPreviewData' in appParams.appData);

interface BlocksDevCenterComponent extends Component {
  compData: {
    studioComponentData: Required<StudioComponentData>;
  };
}

const isBlocksComponent = (comp: Component): comp is BlocksDevCenterComponent =>
  comp.compType === 'STUDIO';

const isValidAppData = (
  app: GetAppSnapshotResponse,
): app is Required<GetAppSnapshotResponse> => Boolean(app?.components);

const toAppParams = (
  app: GetAppSnapshotResponse,
): WidgetControllerConfig['appParams'] | undefined => {
  if (!isValidAppData(app)) {
    return;
  }

  const blocksComp = app.components.find(isBlocksComponent);

  if (!blocksComp) {
    return;
  }

  return {
    appDefinitionId: app.appId,
    appName: app.name,
    baseUrls: blocksComp.compData.studioComponentData.baseUrls,
    blocksData: {
      siteHeaderUrl: blocksComp.compData.studioComponentData.siteHeaderUrl,
      wixCodeGridId: blocksComp.compData.studioComponentData.wixCodeGridId,
      wixCodeInstanceId:
        blocksComp.compData.studioComponentData.wixCodeInstanceId,
    },
    appInstanceId: '',
    appRouters: [],
    instance: '',
    instanceId: '',
    isRollout: false,
    url: '',
  };
};

export function parseBlocksConfigFromAppData(
  app: GetAppSnapshotResponse,
): BlocksConfig | undefined {
  const appParams = toAppParams(app);

  if (!appParams) {
    return;
  }

  return parseBlocksConfig(appParams);
}

export default function parseBlocksConfig(
  appParams: WidgetControllerConfig['appParams'],
): BlocksConfig {
  if (!isBlocksAppParams(appParams)) {
    throw new NotBlocksAppError();
  }

  const { wixCodeInstanceId, wixCodeGridId } = appParams.blocksData;
  const { siteId, metaSiteId, revision } = parseBaseUrlsData(
    appParams.baseUrls,
  );

  return {
    appDefinitionId: appParams.appDefinitionId,
    code: {
      instanceId: wixCodeInstanceId,
      gridId: wixCodeGridId,
      experimentsQueryString:
        appParams.appData?.blocksConsumerData?.codeExperimentsQueryString || '', // Should be replaced with a type guard once WBL-2343 is done
    },
    siteId,
    metaSiteId,
    revision,
    codePackagesData: appParams.appData?.blocksConsumerData?.codePackagesData,
  };
}
export const isPanelControllerConfig = <
  T extends object,
  P extends object = {},
>(
  controllerConfig: ControllerConfig<WidgetConfig<T>, P>,
) => {
  if (!controllerConfig?.wixCodeApi?.location?.url) {
    return false;
  }

  const url = new URL(controllerConfig?.wixCodeApi?.location?.url);
  const sdkVersion = url.searchParams.get('sdkVersion');
  const componentRef = url.searchParams.get('componentRef');

  return sdkVersion !== null && componentRef !== null;
};
