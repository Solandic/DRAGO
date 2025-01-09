import type { ViewerScriptFlowAPI } from '@wix/yoshi-flow-editor';

import { fetchMenusData } from '../current-ma';
import type { AppData, ControllerConfig, WixCodeApi } from '../types';
import { WarmupDataService } from './warmup-data';

export const initAppDataStore = (
  appParams: ControllerConfig['appParams'],
  wixCodeApi: WixCodeApi,
  flowAPI: ViewerScriptFlowAPI,
) => {
  const warmupDataService = new WarmupDataService(wixCodeApi.window.warmupData);
  let appDataPromise: null | Promise<AppData> = null;
  return {
    getAppData: () => {
      if (!appDataPromise) {
        appDataPromise = fetchMenusData({
          appParams,
          wixCodeApi,
          flowAPI,
          warmupDataService,
        });
      }
      return appDataPromise;
    },
  };
};
