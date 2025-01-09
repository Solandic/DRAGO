import type {
  ControllerFlowAPI,
  IHttpClient,
  IPlatformServices,
  IUser,
  ViewerScriptFlowAPI,
} from '@wix/yoshi-flow-editor';

import { INITIAL_WARMUP_DATA } from '../constants';
import type {
  AppData,
  ControllerConfig,
  GlobalControllerConfig,
  Member,
  OldCacheService,
  RawRouter,
  ReturnedRouterData,
  Storage,
  ViewerPublicAPI,
  WarmupDataService,
  WixCodeApi,
} from '../types';
import { toMonitored } from '../utils/monitoring';
import { parseConfigItems } from './config-items-parser';
import { PublicAPI } from './public-api';
import { initInMemoryCacheService } from './services/cache';
import type { GroupsService, PermittedPagesMap } from './services/groups';
import { initGroupsService } from './services/groups';
import { getMemoryStorage, setMemoryStorage } from './services/memory-storage';
import { renderLoginMenus, renderMembersMenus } from './services/menu-renderer';
import { getPagesFromRouters } from './services/page-mapper';
import type { UserService } from './services/user';
import { createUserService } from './services/user';

let _config: ControllerConfig;
let _globalController: GlobalControllerConfig;
let publicApi: PublicAPI;
let userService: UserService;
let groupsService: GroupsService;
let cacheService: OldCacheService;

export const initApplication = async (
  {
    appDefinitionId,
    routerReturnedData,
    appRouters = [],
  }: {
    appDefinitionId: string;
    routerReturnedData: ReturnedRouterData;
    appRouters?: RawRouter[];
  },
  { storage }: { storage: Storage },
  wixCodeApi: WixCodeApi,
  flowAPI: ViewerScriptFlowAPI,
  platformServices: IPlatformServices,
) => {
  userService = createUserService(wixCodeApi, platformServices, flowAPI);
  cacheService = initInMemoryCacheService(storage);
  groupsService = initGroupsService(flowAPI.httpClient, flowAPI.experiments);
  publicApi = new PublicAPI({
    appRouters,
    routerReturnedData,
    wixCodeApi,
    cacheService,
    flowAPI,
  });
  setMemoryStorage(storage.memory);
  await userService.setCurrentUser(
    wixCodeApi.user.currentUser,
    flowAPI.httpClient,
  );

  if (!routerReturnedData) {
    return Promise.resolve();
  }

  const instance = wixCodeApi.site.getAppToken?.(appDefinitionId);
  const slugs =
    (routerReturnedData.memberData && routerReturnedData.memberData.slugs) ||
    [];
  const viewedUserId =
    (routerReturnedData.memberData &&
      routerReturnedData.memberData.memberContactId) ||
    routerReturnedData.userId;
  const primarySlug = slugs.find((slug) => slug.primary);
  const viewedUserSlug = (primarySlug && primarySlug.name) || viewedUserId;
  const viewedUserData: Member = { id: viewedUserId!, slug: viewedUserSlug! };

  userService.setViewedUser(viewedUserData);
  userService.setRoles(routerReturnedData.roles || {});

  if (routerReturnedData.roles) {
    cacheService.setRoles(instance!, viewedUserId, routerReturnedData.roles);
  }
};

const getMenuCounters = async (instance: string, isSSR: boolean) => {
  if (isSSR) {
    return { currentUserCounters: undefined, viewedUserCounters: undefined };
  }

  const currentUser = userService.getCurrentUser();
  const viewedUser = userService.getViewedUser();

  const getUserMenuCounters = async (user: Member) => {
    if (cacheService.hasNumbers(instance, user.id)) {
      return cacheService.getNumbers(instance, user.id)!;
    }

    const menuCounters = await userService.fetchMenuCounters(user);
    cacheService.setNumbers(instance, user.id, menuCounters);

    return menuCounters;
  };

  const isSameSessionUser = viewedUser.id === currentUser.id;
  const currentUserMenuCountersPromise = getUserMenuCounters(currentUser);
  const viewedUserMenuCountersPromise = isSameSessionUser
    ? currentUserMenuCountersPromise
    : viewedUser.id
    ? getUserMenuCounters(viewedUser)
    : Promise.resolve({ apps: [] });

  const [currentUserCounters, viewedUserCounters] = await Promise.all([
    currentUserMenuCountersPromise,
    viewedUserMenuCountersPromise,
  ]);

  return { currentUserCounters, viewedUserCounters };
};

const getRoles = async (instance: string, httpClient: IHttpClient) => {
  const currentUser = userService.getCurrentUser();
  const viewedUser = userService.getViewedUser();

  if (cacheService.hasRoles(instance, viewedUser?.id)) {
    return cacheService.getRoles(instance, viewedUser?.id)!;
  }

  const roles = await userService.fetchRoles(
    viewedUser.id,
    currentUser.id,
    httpClient,
  );
  cacheService.setRoles(instance, viewedUser?.id, roles);

  return roles;
};

type InitialData = {
  counters: Awaited<ReturnType<typeof getMenuCounters>>;
  roles: Awaited<ReturnType<typeof getRoles>>;
  permittedPagesMap: PermittedPagesMap;
};

export async function fetchMenusData({
  wixCodeApi,
  appParams,
  flowAPI,
  warmupDataService,
}: Pick<ControllerConfig, 'wixCodeApi' | 'appParams'> & {
  flowAPI: ViewerScriptFlowAPI;
  warmupDataService: WarmupDataService;
}) {
  const currentUser = userService.getCurrentUser();
  const userRoles = userService.getRoles();
  const viewedUser = userService.getViewedUser();

  const needToFetchRoles =
    currentUser.loggedIn! && Object.keys(userRoles).length === 0;
  const santaMembersToken = wixCodeApi.site.getAppToken?.(
    appParams.appDefinitionId,
  );
  const isSSR = wixCodeApi.window.rendering.env === 'backend';
  const parsedRouters = ((appParams.appRouters as any[]) || []).map(
    (router) => ({
      ...router,
      config: JSON.parse(router.config),
    }),
  );
  const parsedRoutersConfigs = parsedRouters.map((router) => router.config);

  const fetchInitialData = async () => {
    const [counters, roles, permittedPagesMap] = await Promise.all([
      getMenuCounters(santaMembersToken!, isSSR),
      needToFetchRoles ? getRoles(santaMembersToken!, flowAPI.httpClient) : {},
      groupsService.getPermittedPagesMap(
        getPagesFromRouters(parsedRouters),
        wixCodeApi.window.viewMode,
      ),
    ]);

    return { counters, roles, permittedPagesMap };
  };

  let initialData: InitialData;

  if (flowAPI.environment.isSSR) {
    initialData = await fetchInitialData();
    warmupDataService.setData(INITIAL_WARMUP_DATA, initialData);
  } else {
    const warmupData =
      warmupDataService.getData<InitialData>(INITIAL_WARMUP_DATA);
    initialData = warmupData || (await fetchInitialData());
  }

  const { counters, roles, permittedPagesMap } = initialData;

  if (needToFetchRoles) {
    userService.setRoles(roles);
  }

  const parsedConfigItems = parseConfigItems(appParams as any);
  const currentUserRoles = userService.getRoles()[currentUser.id] || [];
  const viewedUserRoles = userService.getRoles()[viewedUser.id] || [];
  const publicRouter = parsedRouters.find(
    (router) => router.config.type === 'public',
  );
  const publicRouterPrefix = publicRouter?.prefix ?? '';

  return {
    counters,
    permittedPagesMap,
    parsedRouters,
    parsedRoutersConfigs,
    parsedConfigItems,
    currentUserRoles,
    viewedUserRoles,
    publicRouterPrefix,
  };
}

export function wrappedRenderMemberMenus(
  config: ControllerConfig,
  appData: AppData,
  flowAPI: ViewerScriptFlowAPI | ControllerFlowAPI,
) {
  const { wixCodeApi, $w } = config;
  const viewedUser = userService.getViewedUser();
  const currentUser = userService.getCurrentUser();
  const isMobile = wixCodeApi.window.formFactor === 'Mobile';
  const memoryStorage = getMemoryStorage();

  const {
    permittedPagesMap,
    parsedRoutersConfigs,
    viewedUserRoles,
    parsedConfigItems,
    counters: { viewedUserCounters },
    publicRouterPrefix,
  } = appData;

  toMonitored('renderMembersMenuItems', () =>
    renderMembersMenus({
      $w,
      wixCodeApi,
      parsedRoutersConfigs,
      viewedUserRoles,
      viewedUser,
      currentUser,
      appsCounters: viewedUserCounters,
      parsedConfigItems,
      memoryStorage,
      publicRouterPrefix,
      permittedPagesMap,
      experiments: flowAPI.experiments,
      isMobile,
      flowAPI,
    }),
  )();
}

export function wrappedRenderLoginMenus(
  config: ControllerConfig,
  appData: AppData,
) {
  const {
    $w,
    essentials: { experiments },
    wixCodeApi,
  } = config;
  const currentUser = userService.getCurrentUser();
  const isMobile = wixCodeApi.window.formFactor === 'Mobile';
  const memoryStorage = getMemoryStorage();

  const {
    permittedPagesMap,
    parsedRoutersConfigs,
    counters: { currentUserCounters },
    publicRouterPrefix,
    currentUserRoles,
  } = appData;

  toMonitored('renderLoginMenuItems', () =>
    renderLoginMenus({
      $w,
      parsedRoutersConfigs,
      currentUserRoles,
      currentUser,
      appsCounters: currentUserCounters,
      memoryStorage,
      publicRouterPrefix,
      permittedPagesMap,
      experiments,
      isMobile,
      wixCodeApi,
    }),
  )();
}

export function renderMenus(
  config: ControllerConfig,
  appData: AppData,
  flowAPI: ViewerScriptFlowAPI | ControllerFlowAPI,
) {
  wrappedRenderLoginMenus(config, appData);
  wrappedRenderMemberMenus(config, appData, flowAPI);
}

export const setGlobalController = (config: GlobalControllerConfig) => {
  _globalController = config;
};

export const setConfigGlobally = (config: ControllerConfig) => {
  _config = config;
};

export const setCurrentUserGlobally = (
  loggedInUser: IUser,
  httpClient: IHttpClient,
) => userService.setCurrentUser(loggedInUser, httpClient);

export const createPublicAPI = (): ViewerPublicAPI => {
  return {
    hasSocialPages: (onSuccess, onError) =>
      toMonitored('publicApi.hasSocialPages', () =>
        publicApi.hasSocialPages(onSuccess, onError),
      )(),
    getViewedUser: (onSuccess, onError) =>
      toMonitored('publicApi.getViewedUser', () =>
        publicApi.getViewedUser(onSuccess, onError),
      )(),
    navigateToSection: (sectionData, onError) =>
      toMonitored('publicApi.navigateToSection', () =>
        publicApi.navigateToSection(sectionData, onError),
      )(),
    navigateToMember: (memberInfo, onError) =>
      toMonitored('publicApi.navigateToMember', () =>
        publicApi.navigateToMember(memberInfo, onError),
      )(),
    getNavigatableRoles: (onError) =>
      toMonitored('publicApi.getNavigatableRoles', () =>
        publicApi.getNavigatableRoles(onError),
      )(),
    getSectionUrl: (sectionData, onError) =>
      toMonitored('publicApi.getSectionUrl', () =>
        publicApi.getSectionUrl(sectionData, onError),
      )(),
    getMemberPagePrefix: (data, onSuccess, onError) =>
      toMonitored('publicApi.getMemberPagePrefix ', () =>
        publicApi.getMemberPagePrefix(data, onSuccess, onError),
      )(),
    setNotificationCount: (displayCount: number) =>
      toMonitored('publicApi.setNotificationCount', () =>
        publicApi.setNotificationCount({
          config: _config,
          userService,
          displayCount,
        }),
      )(),
    enterPublicProfilePreviewMode: () =>
      toMonitored('publicApi.enterPublicProfilePreviewMode', () =>
        publicApi.enterPublicProfilePreviewMode({
          userService,
          config: _config,
        }),
      )(),
    leavePublicProfilePreviewMode: () =>
      toMonitored('publicApi.leavePublicProfilePreviewMode', () =>
        publicApi.leavePublicProfilePreviewMode({
          userService,
          config: _config,
        }),
      )(),
    openBlockedMemberEmptyState: async () => {
      throw new Error(
        'openBlockedMemberEmptyState is only supported in members area v2',
      );
    },
    clearMenus: () =>
      toMonitored('publicApi.clearMenus', () =>
        publicApi.clearMenus({ config: _config }),
      )(),
    getRoutes: () => {
      throw new Error('getRoutes is only supported in members area v2');
    },
    getSettingsRoutes: () => {
      throw new Error('getRoutes is only supported in members area v3');
    },
    getIsMembersAreaSeoEnabled: () =>
      toMonitored('publicApi.getIsMembersAreaSeoEnabled', () =>
        publicApi.getIsMembersAreaSeoEnabled({ config: _globalController }),
      )(),
    isAppSectionInstalled: (sectionData) =>
      toMonitored('publicApi.isAppSectionInstalled', () =>
        publicApi.isAppSectionInstalled(sectionData),
      )(),
    openLightbox: () => {
      throw new Error(
        'openLightbox is only supported in members area v2 and v3',
      );
    },
    getInstalledLightboxes: () => Promise.resolve([]),
  };
};
