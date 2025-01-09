import { PROFILE_PAGE_BOB_APP_DEF_ID, PublicApiError } from '../constants';
import { globalAppState } from '../services/global-app-state';
import type { ProfilePageBobPublicAPI, ViewerPublicAPI } from '../types';
import { toMonitored } from '../utils/monitoring';
import { PublicAPI } from './public-api';

const getProfilePageBobPublicAPI = (): Promise<ProfilePageBobPublicAPI> => {
  const wixCodeApi = globalAppState.getWixCodeAPI()!;

  return wixCodeApi.site.getPublicAPI(PROFILE_PAGE_BOB_APP_DEF_ID);
};

const getRoutes = () => {
  const controllerRoutes =
    globalAppState.getGlobalControllerConfig()?.config?.routes ?? [];
  const appDataRoutes = globalAppState.getRoutes();

  return appDataRoutes.length ? appDataRoutes : controllerRoutes;
};

const getPublicAPI = () => {
  const routes = getRoutes();
  const settingsRoutes = globalAppState.getSettingsRoutes();
  const wixCodeApi = globalAppState.getWixCodeAPI();

  if (!routes?.length) {
    throw new Error(PublicApiError.MissingRoutes);
  }

  if (!wixCodeApi) {
    throw new Error(PublicApiError.NotInitializedWixCodeApi);
  }

  return new PublicAPI(
    routes,
    settingsRoutes,
    wixCodeApi.location,
    wixCodeApi.site,
    wixCodeApi.window,
  );
};

export const createPublicAPI = (): ViewerPublicAPI => {
  return {
    hasSocialPages: (onSuccess, onError) =>
      toMonitored('publicApi.hasSocialPages', () =>
        getPublicAPI().hasSocialPages(onSuccess, onError),
      )(),
    getViewedUser: (onSuccess, onError) =>
      toMonitored('publicApi.getViewedUser', async () => {
        const profilePageBobPublicAPI = await getProfilePageBobPublicAPI();
        return profilePageBobPublicAPI.getViewedUser(onSuccess, onError);
      })(),
    navigateToSection: (sectionData, onError) =>
      toMonitored('publicApi.navigateToSection', () =>
        getPublicAPI().navigateToSection(sectionData, onError),
      )(),
    navigateToMember: (memberInfo, onError) =>
      toMonitored('publicApi.navigateToMember', () =>
        getPublicAPI().navigateToMember(memberInfo, onError),
      )(),
    getNavigatableRoles: (onError) =>
      toMonitored('publicApi.getNavigatableRoles', () =>
        getPublicAPI().getNavigatableRoles(onError),
      )(),
    getSectionUrl: (sectionData, onError) =>
      toMonitored('publicApi.getSectionUrl', () =>
        getPublicAPI().getSectionUrl(sectionData, onError),
      )(),
    getMemberPagePrefix: (data, onSuccess, onError) =>
      toMonitored('publicApi.getMemberPagePrefix ', () =>
        getPublicAPI().getMemberPagePrefix(data, onSuccess, onError),
      )(),
    setNotificationCount: (displayCount) =>
      toMonitored('publicApi.setNotificationCount', () =>
        getPublicAPI().setNotificationCount(displayCount),
      )(),
    enterPublicProfilePreviewMode: () =>
      toMonitored('publicApi.enterPublicProfilePreviewMode', async () => {
        const profilePageBobPublicAPI = await getProfilePageBobPublicAPI();
        return profilePageBobPublicAPI.enterPublicProfilePreviewMode();
      })(),
    leavePublicProfilePreviewMode: () =>
      toMonitored('publicApi.leavePublicProfilePreviewMode', async () => {
        const profilePageBobPublicAPI = await getProfilePageBobPublicAPI();
        return profilePageBobPublicAPI.leavePublicProfilePreviewMode();
      })(),
    openBlockedMemberEmptyState: () =>
      toMonitored('publicApi.openBlockedMemberEmptyState', async () => {
        const profilePageBobPublicAPI = await getProfilePageBobPublicAPI();
        return profilePageBobPublicAPI.openBlockedMemberEmptyState();
      })(),
    clearMenus: () =>
      toMonitored('publicApi.clearMenus', async () => {
        const profilePageBobPublicAPI = await getProfilePageBobPublicAPI();
        return profilePageBobPublicAPI.clearMenus();
      })(),
    getRoutes: (onSuccess) =>
      toMonitored('publicApi.getRoutes', () =>
        getPublicAPI().getRoutes(onSuccess),
      )(),
    getSettingsRoutes: (onSuccess) =>
      toMonitored('publicApi.getSettingsRoutes', () =>
        getPublicAPI().getSettingsRoutes(onSuccess),
      )(),
    getIsMembersAreaSeoEnabled: () =>
      toMonitored('publicApi.getIsMembersAreaSeoEnabled', () =>
        getPublicAPI().getIsMembersAreaSeoEnabled(),
      )(),
    isAppSectionInstalled: (sectionData) =>
      toMonitored('publicApi.isAppSectionInstalled', () =>
        getPublicAPI().isAppSectionInstalled(sectionData),
      )(),
    openLightbox: (tpaPageId, data) =>
      toMonitored('publicApi.openLightbox', () =>
        getPublicAPI().openLightbox(tpaPageId, data),
      )(),
    getInstalledLightboxes: () =>
      toMonitored('publicApi.getInstalledLightboxes', () =>
        getPublicAPI().getInstalledLightboxes(),
      )(),
  };
};
