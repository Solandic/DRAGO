import type { IWixAPI, ViewerScriptFlowAPI } from '@wix/yoshi-flow-editor';

import type {
  GlobalControllerConfig,
  MenuItem,
  Nullable,
  RouteConfiguration,
} from '../types';

interface GlobalAppState {
  getFlowAPI: () => ViewerScriptFlowAPI | null;
  setFlowAPI: (flowAPI: ViewerScriptFlowAPI) => void;
  getWixCodeAPI: () => IWixAPI | null;
  setWixCodeAPI: (wixCodeAPI: IWixAPI) => void;
  getRoutes: () => RouteConfiguration[];
  setRoutes: (routes: RouteConfiguration[]) => void;
  getSettingsRoutes: () => RouteConfiguration[];
  setSettingsRoutes: (routes: RouteConfiguration[]) => void;
  getGlobalControllerConfig: () => Nullable<GlobalControllerConfig>;
  setGlobalControllerConfig: (
    globalControllerConfig: GlobalControllerConfig,
  ) => void;
  getMembersLoginWidgets: () => MenuItem[];
  setMembersLoginWidgets: (newMembersLoginWidgets: MenuItem[]) => void;
}

const initGlobalAppState = (): GlobalAppState => {
  let _flowAPI: ViewerScriptFlowAPI | null = null;
  let _wixCodeApi: IWixAPI | null = null;
  let _routes: RouteConfiguration[] = [];
  let _settingsRoutes: RouteConfiguration[] = [];
  let _globalControllerConfig: Nullable<GlobalControllerConfig> = null;
  let _membersLoginWidgets: MenuItem[];

  return {
    getFlowAPI: () => _flowAPI,
    setFlowAPI: (flowAPI) => (_flowAPI = flowAPI),
    getWixCodeAPI: () => _wixCodeApi,
    setWixCodeAPI: (wixCodeAPI) => (_wixCodeApi = wixCodeAPI),
    getRoutes: () => _routes,
    setRoutes: (routes) => (_routes = routes),
    getSettingsRoutes: () => _settingsRoutes,
    setSettingsRoutes: (routes) => (_settingsRoutes = routes),
    getGlobalControllerConfig: () => _globalControllerConfig,
    setGlobalControllerConfig: (
      globalControllerConfig: GlobalControllerConfig,
    ) => (_globalControllerConfig = globalControllerConfig),
    getMembersLoginWidgets: () => _membersLoginWidgets || [],
    setMembersLoginWidgets: (newMembersLoginWidgets: MenuItem[]) =>
      (_membersLoginWidgets = newMembersLoginWidgets),
  };
};

export const globalAppState = initGlobalAppState();
