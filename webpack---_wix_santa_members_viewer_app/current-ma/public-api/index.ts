import type {
  StructurePage,
  ViewerScriptFlowAPI,
} from '@wix/yoshi-flow-editor';

import { SOCIAL_APPS, USER_NAME_PATTERN } from '../../constants';
import { NOTIFICATIONS_APP_ID } from '../../constants/apps';
import type {
  AppNumbers,
  Callback,
  ControllerConfig,
  GlobalControllerConfig,
  IsSectionInstalledProps,
  MemberInfo,
  Numbers,
  OldCacheService,
  RawRouter,
  ReturnedRouterData,
  RouterConfig,
  SectionData,
  WixCodeApi,
} from '../../types';
import { toMonitored } from '../../utils/monitoring';
import { renderMenus } from '..';
import { parseConfigItems } from '../config-items-parser';
import { getMemoryStorage } from '../services/memory-storage';
import {
  renderEmptyMemberMenus,
  renderMembersMenus,
} from '../services/menu-renderer';
import { getNavigatableHomePage } from '../services/navigation';
import type { UserService } from '../services/user';

const noop = () => {};

export class PublicAPI {
  wixLocation: WixCodeApi['location'];
  wixSite: WixCodeApi['site'];
  isMobile: boolean;
  appRouters: RawRouter[];
  routerReturnedData?: ReturnedRouterData;
  wixCodeApi: WixCodeApi;
  cacheService: OldCacheService;
  flowAPI: ViewerScriptFlowAPI;

  constructor({
    appRouters,
    routerReturnedData,
    wixCodeApi,
    cacheService,
    flowAPI,
  }: {
    appRouters: RawRouter[];
    routerReturnedData?: ReturnedRouterData;
    wixCodeApi: WixCodeApi;
    cacheService: OldCacheService;
    flowAPI: ViewerScriptFlowAPI;
  }) {
    this.wixLocation = wixCodeApi.location;
    this.wixSite = wixCodeApi.site;
    this.isMobile = wixCodeApi.window.formFactor === 'Mobile';
    this.appRouters = appRouters;
    this.routerReturnedData = routerReturnedData;
    this.wixCodeApi = wixCodeApi;
    this.cacheService = cacheService;
    this.flowAPI = flowAPI;
  }

  private async matchRoute({
    appDefinitionId,
    sectionId,
    onSuccess = noop,
    onError = noop,
  }: {
    appDefinitionId: string;
    sectionId: string;
    onSuccess?: Callback;
    onError?: Callback;
  }) {
    if (!appDefinitionId || !sectionId) {
      onError('Error: please provide app ID and section ID for navigation');
    }
    let foundRoute = false;
    this.appRouters.forEach((router) => {
      if (foundRoute) {
        return;
      }
      const config = JSON.parse(router.config);
      return (
        config.patterns &&
        Object.keys(config.patterns).forEach((pattern) => {
          if (foundRoute) {
            return;
          }
          const item = config.patterns[pattern];
          if (
            item.appData &&
            item.appData.appDefinitionId === appDefinitionId &&
            item.appData.appPageId === sectionId
          ) {
            foundRoute = true;
            onSuccess(router.prefix, pattern);
          }
        })
      );
    });

    // look in site pages, not member app routes
    if (!foundRoute) {
      const sitePages = (await this.wixSite.getSiteStructure()).pages;
      const pages = sitePages || [];
      const page = pages
        .filter((pg: any) => pg.applicationId === appDefinitionId && !pg.prefix)
        .pop();

      if (page) {
        foundRoute = true;
        return onSuccess('', page.url);
      }

      return onError(
        `Error: can not resolve route for app ${appDefinitionId} and page ${sectionId}`,
      );
    }
  }

  private getRoute(appDefinitionId: string, sectionId: string) {
    return this.appRouters.find((router) => {
      const config: RouterConfig = JSON.parse(router.config);
      if (!config.patterns) {
        return false;
      }

      return Object.entries(config.patterns).some(([, patternData]) => {
        return (
          patternData.appData?.appDefinitionId === appDefinitionId &&
          patternData.appData?.appPageId === sectionId
        );
      });
    });
  }

  private getRouterOptions(appParams: ControllerConfig['appParams']) {
    const parsedRouters = ((appParams.appRouters as any[]) || []).map(
      (router) => ({
        ...router,
        config: JSON.parse(router.config),
      }),
    );
    const parsedRoutersConfigs = parsedRouters.map((router) => router.config);
    const publicRouter = parsedRouters.find(
      (router) => router.config.type === 'public',
    );
    const publicRouterPrefix = publicRouter!.prefix; // We should always have public router

    return { publicRouterPrefix, parsedRoutersConfigs, parsedRouters };
  }

  private getMenuRenderOptions({
    config,
    userService,
    appsCounters,
    enablePreview,
    flowAPI,
  }: {
    config: ControllerConfig;
    userService: UserService;
    appsCounters: any;
    enablePreview: boolean;
    flowAPI: ViewerScriptFlowAPI;
  }) {
    const { $w, appParams } = config;
    const { parsedRoutersConfigs, publicRouterPrefix, parsedRouters } =
      this.getRouterOptions(appParams);
    const viewedUser = userService.getViewedUser();
    const emptyId = '00000000-0000-0000-0000-000000000000';

    return {
      $w,
      wixCodeApi: this.wixCodeApi,
      publicRouterPrefix,
      parsedRoutersConfigs,
      appsCounters,
      memoryStorage: getMemoryStorage(),
      // @ts-expect-error - Incorrect IControllerConfig type
      parsedConfigItems: parseConfigItems(config.config), // TODO: questionable place, was changed from 'config' to 'config.config'
      currentUser: userService.getCurrentUser(),
      viewedUser: enablePreview ? { ...viewedUser, id: emptyId } : viewedUser,
      viewedUserRoles: userService.getRoles()[viewedUser.id] || [],
      isMobile: this.isMobile,
      experiments: config.essentials.experiments,
      flowAPI,
      parsedRouters,
    };
  }

  private static hasSocialApp(page: StructurePage) {
    // @ts-expect-error Incorrect StructurePage type
    const { applicationId } = page;
    return SOCIAL_APPS.indexOf(applicationId) > -1;
  }

  async hasSocialPages(
    onSuccess?: Callback,
    onError?: Callback,
  ): Promise<boolean> {
    if (!this.appRouters) {
      if (onError) {
        onError('App routers not initialised');
      }
      throw new Error('App routers not initialised');
    }

    const socialPages = this.appRouters.filter((router) => {
      const routerConfig = JSON.parse(router.config);
      return (
        routerConfig.type === 'public' &&
        routerConfig.patterns &&
        Object.keys(routerConfig.patterns).length > 0
      );
    });
    const { pages: sitePages } = await this.wixSite.getSiteStructure();
    const socialApps = sitePages.filter(PublicAPI.hasSocialApp);
    if (onSuccess) {
      onSuccess(socialPages.length > 0 || socialApps.length > 0);
    }
    return socialPages.length > 0 || socialApps.length > 0;
  }

  async getViewedUser(onSuccess?: Callback, onError?: Callback) {
    const viewedUser = this.routerReturnedData?.memberData.memberContactId;

    if (viewedUser) {
      if (onSuccess) {
        onSuccess(viewedUser);
      }
      return viewedUser;
    } else {
      if (onError) {
        onError('Error getting viewed user');
      }
      throw new Error('Error getting viewed user');
    }
  }

  async navigateToSection(
    {
      appDefinitionId,
      sectionId,
      tpaInnerRoute = '',
      memberId = '',
    }: SectionData,
    onError?: Callback,
  ) {
    await this.matchRoute({
      appDefinitionId,
      sectionId,
      onSuccess: (prefix, suffix) => {
        if (prefix && prefix.indexOf('/') !== 0) {
          prefix = `/${prefix}`;
        }

        if (tpaInnerRoute && tpaInnerRoute.charAt(0) !== '/') {
          tpaInnerRoute = '/' + tpaInnerRoute;
        }

        this.wixLocation.to?.(
          `${prefix}${
            memberId ? suffix.replace(USER_NAME_PATTERN, memberId) : suffix
          }${tpaInnerRoute}`,
        );
        return;
      },
      onError: (reason) => {
        if (onError) {
          onError(reason);
        }
        throw new Error(reason);
      },
    });
  }

  async getSectionUrl(
    {
      appDefinitionId,
      sectionId,
      memberId = '',
      memberSlug,
    }: {
      appDefinitionId: string;
      sectionId: string;
      memberId?: string;
      memberSlug?: string;
    },
    callBack?: Callback,
  ) {
    return new Promise((resolve, reject) => {
      const userIndicator = memberSlug || memberId;
      this.matchRoute({
        appDefinitionId,
        sectionId,
        onSuccess: (prefix, suffix) => {
          if (prefix && prefix.indexOf('/') === 0) {
            prefix = prefix.substring(1);
          }

          if (!prefix && suffix.indexOf('/') === 0) {
            suffix = suffix.substring(1);
          }

          let baseUrl = this.wixLocation.baseUrl;
          if (baseUrl.slice(-1) !== '/') {
            baseUrl += '/';
          }

          const queryParams = Object.keys(this.wixLocation.query)
            .map((key) => {
              return `${key}=${this.wixLocation.query[key]}`;
            })
            .join('&');
          if (callBack) {
            callBack(
              `${baseUrl}${prefix}${
                userIndicator
                  ? suffix.replace(USER_NAME_PATTERN, userIndicator)
                  : suffix
              }${queryParams ? '?' + queryParams : ''}`,
            );
          }
          resolve(
            `${baseUrl}${prefix}${
              userIndicator
                ? suffix.replace(USER_NAME_PATTERN, userIndicator)
                : suffix
            }${queryParams ? '?' + queryParams : ''}`,
          );
        },
        onError: () => {
          if (callBack) {
            callBack(this.wixLocation.url);
          }
          reject(this.wixLocation.url);
        },
      });
    });
  }

  async getNavigatableRoles(onError?: Callback) {
    const pageToNavigateTo = getNavigatableHomePage(this.appRouters);
    if (pageToNavigateTo) {
      const navigatableMembersRoles =
        pageToNavigateTo.pageData.appData?.visibleForRoles ?? [];
      return {
        navigatableMembersRoles,
        isNavigationAllowed: true,
      };
    } else {
      return {
        navigatableMembersRoles: [],
        isNavigationAllowed: false,
      };
    }
  }

  async navigateToMember(
    { memberId, memberSlug }: MemberInfo,
    onError?: Callback,
  ) {
    const userIndicator = memberSlug || memberId;
    if (!memberId) {
      if (onError) {
        onError('Error: please provide site member ID');
      }
      throw new Error('Error: please provide site member ID');
    }
    const pageToNavigateTo = getNavigatableHomePage(this.appRouters);
    if (pageToNavigateTo) {
      const route = `/${
        pageToNavigateTo.routerPrefix
      }${pageToNavigateTo.patternKey.replace(
        USER_NAME_PATTERN,
        userIndicator,
      )}`;
      this.wixLocation.to?.(route);
    }
  }

  async getMemberPagePrefix(
    { type = 'public' },
    onSuccess?: Callback,
    onError?: Callback,
  ) {
    if (!this.appRouters) {
      if (onError) {
        onError(`Can not get prefix for type ${type} - no routers`);
      }
      throw new Error(`Can not get prefix for type ${type} - no routers`);
    }
    const router = this.appRouters
      .filter((r) => JSON.parse(r.config).type === type)
      .pop();

    if (!router) {
      if (onError) {
        onError(`Can not get prefix for type ${type}`);
      }
      throw new Error(`Can not get prefix for type ${type}`);
    }
    if (onSuccess) {
      onSuccess({ type, prefix: router.prefix });
    }
    return { type, prefix: router.prefix };
  }

  private updateCounterForNotificationApp(
    appsCounters: Numbers | null,
    displayCount: number | null,
  ): Numbers {
    const count = displayCount || undefined;

    const baseCounter: AppNumbers = {
      appDefId: NOTIFICATIONS_APP_ID,
      numbers: {
        notificationsCount: {
          public: false,
          count,
        },
      },
    };

    const notificationsCounter = !!appsCounters?.apps?.find(
      ({ appDefId }) => appDefId === NOTIFICATIONS_APP_ID,
    );

    if (!notificationsCounter) {
      return {
        apps: [...(appsCounters?.apps || []), baseCounter],
      };
    }

    return {
      apps: appsCounters!.apps.map((counter) => {
        return counter.appDefId === NOTIFICATIONS_APP_ID
          ? {
              ...counter,
              numbers: {
                ...counter.numbers,
                notificationsCount: {
                  ...counter.numbers?.notificationsCount,
                  count,
                },
              },
            }
          : counter;
      }),
    };
  }

  async setNotificationCount({
    config,
    userService,
    displayCount,
  }: {
    config: ControllerConfig;
    userService: UserService;
    displayCount: number | null;
  }) {
    const instance = this.wixCodeApi?.site?.getAppToken?.(
      config.appParams.appDefinitionId,
    )!;
    const currentUser = userService.getCurrentUser();
    const viewedUser = userService.getViewedUser();
    const appsCounters = this.updateCounterForNotificationApp(
      this.cacheService.getNumbers(instance, currentUser.id),
      displayCount,
    );

    this.cacheService.setNumbers(instance, currentUser.id, appsCounters);

    const menuRenderOptions = this.getMenuRenderOptions({
      config,
      userService,
      appsCounters,
      enablePreview: false,
      flowAPI: this.flowAPI,
    });

    const {
      publicRouterPrefix,
      parsedRouters,
      parsedRoutersConfigs,
      parsedConfigItems,
      viewedUserRoles,
    } = menuRenderOptions;

    const appData = {
      counters: {
        currentUserCounters: appsCounters,
        viewedUserCounters:
          this.cacheService.getNumbers(instance, viewedUser.id) ?? undefined,
      },
      permittedPagesMap: {},
      parsedRouters,
      parsedRoutersConfigs,
      parsedConfigItems,
      currentUserRoles: userService.getRoles()[currentUser.id],
      viewedUserRoles,
      publicRouterPrefix,
    };

    return toMonitored('renderMembersMenuItems', () =>
      renderMenus(config, appData, this.flowAPI),
    )();
  }

  async enterPublicProfilePreviewMode({
    config,
    userService,
  }: {
    config: ControllerConfig;
    userService: UserService;
  }) {
    const { appParams } = config;
    const viewedUser = userService.getViewedUser();
    const instance = this.wixCodeApi?.site?.getAppToken?.(
      appParams.appDefinitionId,
    )!;

    const appsCounters = this.cacheService.hasNumbers(instance, viewedUser.id)
      ? this.cacheService.getNumbers(instance, viewedUser.id)
      : userService.fetchMenuCounters(viewedUser);

    const menuRenderOptions = this.getMenuRenderOptions({
      config,
      userService,
      appsCounters,
      enablePreview: true,
      flowAPI: this.flowAPI,
    });

    return toMonitored('renderMembersMenuItems', () =>
      renderMembersMenus(menuRenderOptions),
    )();
  }

  leavePublicProfilePreviewMode({
    config,
    userService,
  }: {
    config: ControllerConfig;
    userService: UserService;
  }) {
    const { appParams } = config;
    const viewedUser = userService.getViewedUser();
    const instance = this.wixCodeApi?.site?.getAppToken?.(
      appParams.appDefinitionId,
    )!;

    const appsCounters = this.cacheService.hasNumbers(instance, viewedUser.id)
      ? this.cacheService.getNumbers(instance, viewedUser.id)
      : userService.fetchMenuCounters(viewedUser);
    const menuRenderOptions = this.getMenuRenderOptions({
      config,
      userService,
      appsCounters,
      enablePreview: false,
      flowAPI: this.flowAPI,
    });
    return toMonitored('renderMembersMenuItems', () =>
      renderMembersMenus(menuRenderOptions),
    )();
  }

  clearMenus({ config }: { config: ControllerConfig }) {
    return renderEmptyMemberMenus(config?.$w);
  }

  getIsMembersAreaSeoEnabled({ config }: { config: GlobalControllerConfig }) {
    const isMembersAreaSeoEnabled = config?.config.isMembersAreaSeoEnabled;
    return Promise.resolve(isMembersAreaSeoEnabled);
  }

  isAppSectionInstalled({
    appDefinitionId,
    sectionId,
  }: IsSectionInstalledProps) {
    return !!this.getRoute(appDefinitionId, sectionId);
  }
}
