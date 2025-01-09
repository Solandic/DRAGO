import { WidgetId } from '@wix/members-area-app-definitions';
import type { ILocation, ISiteApis, IWixWindow } from '@wix/yoshi-flow-editor';

import { PROFILE_PAGE_BOB_APP_DEF_ID, PublicApiError } from '../../constants';
import { globalAppState } from '../../services/global-app-state';
import type {
  Callback,
  IsSectionInstalledProps,
  LightboxData,
  LightboxTpaPageId,
  MemberInfo,
  RouteConfiguration,
  RouterConfig,
  SectionData,
  SiteStructureWithPageIds,
  ViewerPublicAPI,
} from '../../types';

export class PublicAPI
  implements
    Omit<
      ViewerPublicAPI,
      | 'openBlockedMemberEmptyState'
      | 'clearMenus'
      | 'getViewedUser'
      | 'enterPublicProfilePreviewMode'
      | 'leavePublicProfilePreviewMode'
    >
{
  constructor(
    private readonly routes: RouteConfiguration[],
    private readonly settingsRoutes: RouteConfiguration[],
    private readonly location: ILocation,
    private readonly site: ISiteApis,
    private readonly window: Pick<IWixWindow, 'openLightboxById'>,
  ) {}

  async hasSocialPages(onSuccess?: Callback, onError?: Callback) {
    const routes = await this.getRoutes(onSuccess);

    if (!routes.length) {
      return Promise.resolve(false);
    }

    const hasSocialApps = routes.some((route) => !route.private);

    onSuccess?.(hasSocialApps);

    return Promise.resolve(hasSocialApps);
  }

  async getRoutes(onSuccess?: Callback) {
    onSuccess?.(this.routes);
    return Promise.resolve(this.routes);
  }

  // Temporary adding it here until we will create setup for the V3
  async getSettingsRoutes(onSuccess?: Callback) {
    onSuccess?.(this.settingsRoutes);
    return Promise.resolve(this.settingsRoutes);
  }

  async navigateToSection(
    {
      memberId = '',
      tpaInnerRoute = '',
      widgetId,
      appDefinitionId,
    }: SectionData,
    onError?: Callback,
  ) {
    if (!widgetId) {
      const pageURL = await this.getPageUrlByAppDefId(appDefinitionId, onError);
      this.location.to?.(pageURL);

      return Promise.resolve();
    }

    const route = await this.findRouteByWidgetId(widgetId, onError);

    if (!route) {
      onError?.(PublicApiError.CannotFindPageToNavigateTo);
      throw new Error(PublicApiError.CannotFindPageToNavigateTo);
    }

    const membersAreaSectionURL = await this.getMembersAreaSectionURL({
      suffix: route.path,
      memberId,
      tpaInnerRoute,
      onError,
    });

    // special case for following-followers widget, we need to refresh the page to get the correct url in iframe
    if (widgetId === WidgetId.FollowingFollowers) {
      this.location.to?.(`${this.location.baseUrl}${membersAreaSectionURL}`);

      return Promise.resolve();
    }

    this.location.to?.(membersAreaSectionURL);

    return Promise.resolve();
  }

  async navigateToMember(
    { memberId, memberSlug }: MemberInfo,
    onError?: Callback,
  ) {
    if (!memberId) {
      onError?.(PublicApiError.MissingMemberId);
      throw new Error(PublicApiError.MissingMemberId);
    }

    const navigableHomePage = await this.getNavigableHomePage(onError);

    if (navigableHomePage) {
      const membersAreaSectionURL = await this.getMembersAreaSectionURL({
        suffix: navigableHomePage.suffix,
        memberId: memberSlug || memberId,
        onError,
      });

      this.location.to?.(membersAreaSectionURL);
    } else {
      onError?.(PublicApiError.CannotNavigateToMemberNoPublicPage);
      throw new Error(PublicApiError.CannotNavigateToMemberNoPublicPage);
    }

    return Promise.resolve();
  }

  async getNavigatableRoles(onError?: Callback) {
    const pageToNavigateTo = await this.getNavigableHomePage(onError);
    if (pageToNavigateTo) {
      const navigableMembersRoles = pageToNavigateTo.visibleForRoles ?? [];
      return {
        navigatableMembersRoles: navigableMembersRoles,
        isNavigationAllowed: true,
      };
    } else {
      return {
        navigatableMembersRoles: [],
        isNavigationAllowed: false,
      };
    }
  }

  async getSectionUrl(
    {
      widgetId,
      memberId = '',
      memberSlug = '',
      tpaInnerRoute = '',
      appDefinitionId,
    }: SectionData,
    onError?: Callback,
  ) {
    if (!widgetId) {
      return this.getPageUrlByAppDefId(appDefinitionId, onError);
    }

    let baseUrl = this.location.baseUrl;
    if (baseUrl.slice(-1) === '/') {
      baseUrl = baseUrl.slice(0, -1);
    }

    const route = await this.findRouteByWidgetId(widgetId, onError);

    if (!route) {
      onError?.(`${PublicApiError.RouteNotFound} ${widgetId}`);
      throw new Error(`${PublicApiError.RouteNotFound} ${widgetId}`);
    }

    const membersAreaSectionURL = await this.getMembersAreaSectionURL({
      suffix: route.path,
      memberId,
      memberSlug,
      tpaInnerRoute,
      onError,
    });

    return `${baseUrl}${membersAreaSectionURL}`;
  }

  async getMemberPagePrefix(
    data: RouterConfig,
    onSuccess?: Callback,
    onError?: Callback,
  ) {
    const prefix = await this.getMembersAreaPagePrefix(onError);
    return { prefix };
  }

  setNotificationCount(displayCount: number) {
    const membersLoginWidgets = globalAppState.getMembersLoginWidgets();

    membersLoginWidgets.forEach((widget) => {
      if (widget.navBarItems?.length) {
        widget.navBarItems = [
          {
            ...widget.navBarItems[0],
            displayCount: displayCount > 0 ? displayCount : null,
          },
        ];
      }
    });

    return Promise.resolve();
  }

  getIsMembersAreaSeoEnabled() {
    return Promise.resolve(true);
  }

  async isAppSectionInstalled({ widgetId }: IsSectionInstalledProps) {
    const route = await this.findRouteByWidgetId(widgetId);

    return !!route;
  }

  async openLightbox<T extends LightboxTpaPageId>(
    tpaPageId: T,
    data: LightboxData<T>,
  ) {
    const lightboxId = await this.getLightboxIdByTpaPageId(tpaPageId);

    if (!lightboxId) {
      throw new Error(`Lightbox ${tpaPageId} is not installed`);
    }

    return this.window.openLightboxById(lightboxId, data);
  }

  async getInstalledLightboxes() {
    const { lightboxes } = await this.getSiteStructure();
    return lightboxes.map(({ tpaPageId }) => tpaPageId as LightboxTpaPageId);
  }

  private async getPageUrlByAppDefId(
    appDefinitionId: string,
    onError?: Callback,
  ) {
    const { pages } = await this.getSiteStructure();

    const page = pages.find(
      (_page) => _page.applicationId === appDefinitionId && !_page.prefix,
    );

    if (!page?.url) {
      onError?.(PublicApiError.CannotFindPageToNavigateTo);
      throw new Error(PublicApiError.CannotFindPageToNavigateTo);
    }

    return page.url;
  }

  private async getNavigableHomePage(onError?: Callback) {
    const routes = await this.getRoutes();
    const publicRoutes = routes.filter((route) => !route.private);

    if (!publicRoutes.length) {
      return;
    }

    const navigableHomePage = publicRoutes.find((route) => route.home);
    const prefix = await this.getMembersAreaPagePrefix(onError);

    if (navigableHomePage) {
      return {
        prefix,
        suffix: navigableHomePage.path,
        visibleForRoles: navigableHomePage.vfr,
      };
    } else {
      const firstNavigableRoute = publicRoutes[0];
      return {
        prefix,
        suffix: firstNavigableRoute.path,
        visibleForRoles: firstNavigableRoute.vfr,
      };
    }
  }

  private getSiteStructure() {
    return this.site.getSiteStructure({
      includePageId: true,
    }) as Promise<SiteStructureWithPageIds>;
  }

  private async getMembersAreaPagePrefix(onError?: Callback) {
    const { prefixes } = await this.getSiteStructure();
    const membersAreaPagePrefixData = prefixes.find(
      ({ applicationId }) => applicationId === PROFILE_PAGE_BOB_APP_DEF_ID,
    );

    if (!membersAreaPagePrefixData) {
      onError?.(PublicApiError.MissingMembersAreaPage);
      throw new Error(PublicApiError.MissingMembersAreaPage);
    }

    return membersAreaPagePrefixData.prefix;
  }

  private async getMembersAreaSectionURL({
    suffix,
    memberId,
    memberSlug,
    tpaInnerRoute,
    onError,
  }: {
    suffix: string;
    memberId?: string;
    memberSlug?: string;
    tpaInnerRoute?: string;
    onError?: Callback;
  }) {
    const userIndicator = memberSlug || memberId;
    const innerMembersAreaPath = memberId
      ? `/${userIndicator}/${suffix}`
      : `/${suffix}`;
    const membersAreaPrefix = await this.getMembersAreaPagePrefix(onError);

    const membersAreaPath = `${membersAreaPrefix}${innerMembersAreaPath}`;

    if (!tpaInnerRoute) {
      return membersAreaPath;
    }

    const innerRoute =
      tpaInnerRoute?.charAt(0) !== '/' ? `/${tpaInnerRoute}` : tpaInnerRoute;

    return `${membersAreaPath}${innerRoute}`;
  }

  private async findRouteByWidgetId(widgetId: WidgetId, onError?: Callback) {
    const routes = await this.getRoutes();
    return routes.find((route) => route.widgetId === widgetId);
  }

  private async getLightboxIdByTpaPageId(tpaPageId: LightboxTpaPageId) {
    const { lightboxes } = await this.getSiteStructure();
    const lightboxData = lightboxes.find(
      (lightbox) => lightbox.tpaPageId === tpaPageId,
    );

    return lightboxData?.id;
  }
}
