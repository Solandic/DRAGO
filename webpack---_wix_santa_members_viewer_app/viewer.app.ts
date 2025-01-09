import type { InitAppForPageFn } from '@wix/yoshi-flow-editor';
import { configure } from 'mobx';

import {
  createPublicAPI as currentMACreatePublicAPI,
  initApplication,
} from './current-ma';
import { createPublicAPI as maV2CreatePublicAPI } from './ma-v2';
import { createPublicAPI as maV3CreatePublicAPI } from './ma-v3';
import { initAppDataStore } from './services/app-data-store';
import { globalAppState } from './services/global-app-state';
import type { RouteConfiguration, ViewerPublicAPI } from './types';
import { initializeMonitoring, toMonitored } from './utils/monitoring';
import {
  isProfilePageBoBInstalled,
  isSettingsPageInstalled,
} from './utils/site';

enum MembersAreaContext {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
}

type PublicAPIFactory = () => ViewerPublicAPI;

configure({ isolateGlobalState: true });

const getMembersAreaContext = async () => {
  const wixCodeApi = globalAppState.getWixCodeAPI();

  const [shouldUseV3Context, shouldUseV2Context] = await Promise.all([
    isSettingsPageInstalled(wixCodeApi),
    isProfilePageBoBInstalled(wixCodeApi),
  ]);

  if (shouldUseV3Context) {
    return MembersAreaContext.V3;
  } else if (shouldUseV2Context) {
    return MembersAreaContext.V2;
  }

  return MembersAreaContext.V1;
};

const publicAPIMap: Record<MembersAreaContext, PublicAPIFactory> = {
  [MembersAreaContext.V1]: currentMACreatePublicAPI,
  [MembersAreaContext.V2]: maV2CreatePublicAPI,
  [MembersAreaContext.V3]: maV3CreatePublicAPI,
};

const getViewerPlatformExports = async () => {
  const membersAreaContext = await getMembersAreaContext();
  const publicAPIFactory = publicAPIMap[membersAreaContext];

  return publicAPIFactory();
};

export const initAppForPage: InitAppForPageFn = async (
  initParams,
  platformApis,
  wixCodeApi,
  platformServices,
  flowApi,
) => {
  // @ts-expect-error - missing publicData type
  const publicAppData = initParams.publicData?.APP;
  const routes: RouteConfiguration[] = publicAppData?.routes ?? [];
  const settingsRoutes: RouteConfiguration[] =
    publicAppData?.settingsRoutes ?? [];

  initializeMonitoring(initParams, platformServices);
  globalAppState.setFlowAPI(flowApi);
  globalAppState.setWixCodeAPI(wixCodeApi);
  globalAppState.setRoutes(routes);
  globalAppState.setSettingsRoutes(settingsRoutes);

  const appDataStore = initAppDataStore(initParams, wixCodeApi, flowApi);
  const initApplicationPromise = toMonitored('initAppForPage', () =>
    initApplication(
      initParams as any,
      platformApis as any,
      wixCodeApi,
      flowApi,
      platformServices,
    ),
  )();

  return {
    initApplication: async () => {
      await initApplicationPromise;
      return appDataStore.getAppData();
    },
  };
};

export const exports = () => {
  return getViewerPlatformExports();
};
