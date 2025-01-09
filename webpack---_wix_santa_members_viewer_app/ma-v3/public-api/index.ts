import { WidgetId } from '@wix/members-area-app-definitions';
import type { ILocation, ISiteApis, IWixWindow } from '@wix/yoshi-flow-editor';

import {
  MEMBER_SETTINGS_TPA_PAGE_ID,
  MEMBER_TPA_PAGE_ID,
  MembersAreaRouteType,
  PROFILE_PAGE_BOB_APP_DEF_ID,
  PublicApiError,
} from '../../constants';
import { globalAppState } from '../../services/global-app-state';
import type {
  BaseSectionData,
  Callback,
  IsSectionInstalledProps,
  LightboxData,
  LightboxTpaPageId,
  MemberInfo,
  RouteConfiguration,
  RouteData,
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
    const hasSocialApps = routes.length > 0;

    onSuccess?.(hasSocialApps);

    return Promise.resolve(hasSocialApps);
  }

  async getRoutes(onSuccess?: Callback) {
    onSuccess?.(this.routes);
    return Promise.resolve(this.routes);
  }

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
      sectionId,
    }: SectionData,
    onError?: Callback,
  ) {
    const routeData = await this.findRouteByWidgetId(widgetId);

    if (routeData) {
      return this.navigateByRoute(
        {
          routeData,
          memberId,
          tpaInnerRoute,
          widgetId,
        },
        onError,
      );
    }

    return this.navigateByPagePath(
      {
        appDefinitionId,
        sectionId,
      },
      onError,
    );
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
      const membersAreaSectionURL = await this.getMembersAreaSectionURL(
        {
          suffix: navigableHomePage.suffix,
          memberId: memberSlug || memberId,
        },
        onError,
      );
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
      appDefinitionId,
      sectionId,
      memberId,
      memberSlug,
      widgetId,
      tpaInnerRoute,
    }: SectionData,
    onError?: Callback,
  ) {
    const routeData = await this.findRouteByWidgetId(widgetId);

    if (routeData) {
      const membersAreaSectionURL = await this.getMembersAreaSectionURL(
        {
          suffix: routeData.route.path,
          memberId,
          memberSlug,
          tpaInnerRoute,
        },
        onError,
      );

      return this.prependBaseUrl(membersAreaSectionURL);
    }

    const { url } = await this.site.getSectionUrl({
      appDefinitionId,
      sectionId,
    });

    if (!url) {
      onError?.(PublicApiError.SectionUrlNotFound);
      throw new Error(PublicApiError.SectionUrlNotFound);
    }

    return url;
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
        widget.navBarItems = [{ ...widget.navBarItems[0], displayCount }];
      }
    });

    return Promise.resolve();
  }

  getIsMembersAreaSeoEnabled() {
    return Promise.resolve(true);
  }

  async isAppSectionInstalled({
    appDefinitionId,
    sectionId,
    widgetId,
  }: IsSectionInstalledProps) {
    return !!(
      (await this.findRouteByWidgetId(widgetId)) ||
      (await this.findPage({
        appDefinitionId,
        sectionId,
      }))
    );
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

  private async getPagePath(sectionData: BaseSectionData) {
    const page = await this.findPage(sectionData);
    return page?.url;
  }

  private async findPage({ appDefinitionId, sectionId }: BaseSectionData) {
    const { pages } = await this.getSiteStructure();

    return pages.find(
      (page) =>
        page.applicationId === appDefinitionId &&
        page.tpaPageId === sectionId &&
        !page.prefix,
    );
  }

  private async prependBaseUrl(path: string) {
    let baseUrl = this.location.baseUrl;
    if (baseUrl.slice(-1) === '/') {
      baseUrl = baseUrl.slice(0, -1);
    }

    return `${baseUrl}${path}`;
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
    const membersAreaPage = await this.findPage({
      appDefinitionId: PROFILE_PAGE_BOB_APP_DEF_ID,
      sectionId: MEMBER_TPA_PAGE_ID,
    });

    if (!membersAreaPage?.url) {
      onError?.(PublicApiError.MissingMembersAreaPage);
      throw new Error(PublicApiError.MissingMembersAreaPage);
    }

    return membersAreaPage.url;
  }

  private async getMemberSettingsPagePrefix(onError?: Callback) {
    const memberSettingsPage = await this.findPage({
      appDefinitionId: PROFILE_PAGE_BOB_APP_DEF_ID,
      sectionId: MEMBER_SETTINGS_TPA_PAGE_ID,
    });

    if (!memberSettingsPage?.url) {
      onError?.(PublicApiError.MissingMembersAreaSettingsPage);
      throw new Error(PublicApiError.MissingMembersAreaSettingsPage);
    }

    return memberSettingsPage.url;
  }

  private async getMembersAreaSectionURL(
    {
      suffix,
      memberId,
      memberSlug,
      tpaInnerRoute,
    }: {
      suffix: string;
      memberId?: string;
      memberSlug?: string;
      tpaInnerRoute?: string;
    },
    onError?: Callback,
  ) {
    const userIndicator = memberSlug || memberId;
    const innerMembersAreaPath = memberId
      ? `/${userIndicator}/${suffix}`
      : `/${suffix}`;

    const membersAreaPrefix = await this.getMembersAreaPagePrefix(onError);

    const profilePagePath = `${membersAreaPrefix}${innerMembersAreaPath}`;

    if (!tpaInnerRoute) {
      return profilePagePath;
    }

    const innerRoute =
      tpaInnerRoute?.charAt(0) !== '/' ? `/${tpaInnerRoute}` : tpaInnerRoute;

    return `${profilePagePath}${innerRoute}`;
  }

  private async getMemberSettingsSectionURL(
    suffix: string,
    onError?: Callback,
  ) {
    const memberSettingsPagePrefix = await this.getMemberSettingsPagePrefix(
      onError,
    );

    return `${memberSettingsPagePrefix}/${suffix}`;
  }

  private async findRouteByWidgetId(
    widgetId: WidgetId,
  ): Promise<RouteData | null> {
    const routes = await this.getRoutes();

    const memberPageRoute = routes.find((route) => route.widgetId === widgetId);
    if (memberPageRoute) {
      return {
        route: memberPageRoute,
        type: MembersAreaRouteType.Profile,
      };
    }

    const settingsRoutes = await this.getSettingsRoutes();

    const settingsPageRoute = settingsRoutes.find(
      (settingsRoute) => settingsRoute.widgetId === widgetId,
    );
    if (settingsPageRoute) {
      return {
        route: settingsPageRoute,
        type: MembersAreaRouteType.Settings,
      };
    }

    return null;
  }

  private async navigateToMembersAreaSection(
    {
      suffix,
      memberId,
      tpaInnerRoute,
      widgetId,
    }: {
      suffix: string;
      memberId: string;
      tpaInnerRoute?: string;
      widgetId: WidgetId;
    },
    onError?: Callback,
  ) {
    const membersAreaSectionURL = await this.getMembersAreaSectionURL(
      {
        suffix,
        memberId,
        tpaInnerRoute,
      },
      onError,
    );

    // special case for following-followers widget, we need to refresh the page to get the correct url in iframe
    if (widgetId === WidgetId.FollowingFollowers) {
      this.location.to?.(`${this.location.baseUrl}${membersAreaSectionURL}`);
      return Promise.resolve();
    }

    this.location.to?.(membersAreaSectionURL);
    return Promise.resolve();
  }

  private async navigateToMemberSettingsSection(
    suffix: string,
    onError?: Callback,
  ) {
    const memberSettingsSectionURL = await this.getMemberSettingsSectionURL(
      suffix,
      onError,
    );

    this.location.to?.(memberSettingsSectionURL);
    return Promise.resolve();
  }

  private async navigateByRoute(
    {
      routeData,
      memberId,
      widgetId,
      tpaInnerRoute,
    }: {
      routeData: RouteData;
      memberId: string;
      widgetId: WidgetId;
      tpaInnerRoute?: string;
    },
    onError?: Callback,
  ) {
    switch (routeData.type) {
      case MembersAreaRouteType.Profile:
        return this.navigateToMembersAreaSection(
          {
            suffix: routeData.route.path,
            memberId,
            tpaInnerRoute,
            widgetId,
          },
          onError,
        );

      case MembersAreaRouteType.Settings:
        return this.navigateToMemberSettingsSection(
          routeData.route.path,
          onError,
        );
    }
  }

  private async navigateByPagePath(
    { appDefinitionId, sectionId }: BaseSectionData,
    onError?: Callback,
  ) {
    const pagePath = await this.getPagePath({
      appDefinitionId,
      sectionId,
    });

    if (!pagePath) {
      onError?.(PublicApiError.CannotFindPageToNavigateTo);
      throw new Error(PublicApiError.CannotFindPageToNavigateTo);
    }

    this.location.to?.(pagePath);
    return Promise.resolve();
  }

  private async getLightboxIdByTpaPageId(tpaPageId: LightboxTpaPageId) {
    const { lightboxes } = await this.getSiteStructure();
    const lightboxData = lightboxes.find(
      (lightbox) => lightbox.tpaPageId === tpaPageId,
    );

    return lightboxData?.id;
  }
}
