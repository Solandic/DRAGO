import { PROFILE_PAGE_BOB_APP_DEF_ID, PublicApiError } from '../constants';
import { globalAppState } from '../services/global-app-state';
import type { ProfilePageBobPublicAPI, ViewerPublicAPI } from '../types';
import { toMonitored } from '../utils/monitoring';
import { PublicAPI } from './public-api';

const getBlocksPlatformPublicAPI = async () => {
  const wixCodeAPI = globalAppState.getWixCodeAPI()!;
  const publicAPI = await wixCodeAPI.site.getPublicAPI(
    PROFILE_PAGE_BOB_APP_DEF_ID,
  );

  return publicAPI as ProfilePageBobPublicAPI;
};

const getPublicAPI = () => {
  const settingsRoutes = globalAppState.getSettingsRoutes();
  const routes = globalAppState.getRoutes();
  const wixCodeApi = globalAppState.getWixCodeAPI();

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
    hasSocialPages: (onSuccess, onError) => {
      const action = () => getPublicAPI().hasSocialPages(onSuccess, onError);
      return toMonitored('v3.publicApi.hasSocialPages', action)();
    },
    getViewedUser: (onSuccess, onError) => {
      const action = async () => {
        const blocksPlatformPublicAPI = await getBlocksPlatformPublicAPI();
        return blocksPlatformPublicAPI.getViewedUser(onSuccess, onError);
      };
      return toMonitored('v3.publicApi.getViewedUser', action)();
    },
    navigateToSection: (sectionData, onError) => {
      const action = () => {
        return getPublicAPI().navigateToSection(sectionData, onError);
      };
      return toMonitored('v3.publicApi.navigateToSection', action)();
    },
    navigateToMember: (memberInfo, onError) => {
      const action = () => getPublicAPI().navigateToMember(memberInfo, onError);
      return toMonitored('v3.publicApi.navigateToMember', action)();
    },
    getNavigatableRoles: (onError) => {
      const action = () => getPublicAPI().getNavigatableRoles(onError);
      return toMonitored('v3.publicApi.getNavigatableRoles', action)();
    },
    getSectionUrl: (sectionData, onError) => {
      const action = () => getPublicAPI().getSectionUrl(sectionData, onError);
      return toMonitored('v3.publicApi.getSectionUrl', action)();
    },
    getMemberPagePrefix: (data, onSuccess, onError) => {
      const action = () => {
        return getPublicAPI().getMemberPagePrefix(data, onSuccess, onError);
      };
      return toMonitored('v3.publicApi.getMemberPagePrefix ', action)();
    },
    setNotificationCount: (displayCount) => {
      const action = () => getPublicAPI().setNotificationCount(displayCount);
      return toMonitored('v3.publicApi.setNotificationCount', action)();
    },
    enterPublicProfilePreviewMode: () => {
      const action = async () => {
        const profilePageBobPublicAPI = await getBlocksPlatformPublicAPI();
        return profilePageBobPublicAPI.enterPublicProfilePreviewMode();
      };
      return toMonitored(
        'v3.publicApi.enterPublicProfilePreviewMode',
        action,
      )();
    },
    leavePublicProfilePreviewMode: () => {
      const action = async () => {
        const profilePageBobPublicAPI = await getBlocksPlatformPublicAPI();
        return profilePageBobPublicAPI.leavePublicProfilePreviewMode();
      };
      return toMonitored(
        'v3.publicApi.leavePublicProfilePreviewMode',
        action,
      )();
    },
    openBlockedMemberEmptyState: () => {
      const action = async () => {
        const profilePageBobPublicAPI = await getBlocksPlatformPublicAPI();
        return profilePageBobPublicAPI.openBlockedMemberEmptyState();
      };
      return toMonitored('v3.publicApi.openBlockedMemberEmptyState', action)();
    },
    clearMenus: () => {
      const action = async () => {
        const profilePageBobPublicAPI = await getBlocksPlatformPublicAPI();
        return profilePageBobPublicAPI.clearMenus();
      };
      return toMonitored('v3.publicApi.clearMenus', action)();
    },
    getRoutes: (onSuccess) => {
      const action = () => getPublicAPI().getRoutes(onSuccess);
      return toMonitored('v3.publicApi.getRoutes', action)();
    },
    getSettingsRoutes: (onSuccess) => {
      const action = () => getPublicAPI().getSettingsRoutes(onSuccess);
      return toMonitored('v3.publicApi.getSettingsRoutes', action)();
    },
    getIsMembersAreaSeoEnabled: () => {
      const action = () => getPublicAPI().getIsMembersAreaSeoEnabled();
      return toMonitored('v3.publicApi.getIsMembersAreaSeoEnabled', action)();
    },
    isAppSectionInstalled: (sectionData) => {
      const action = () => getPublicAPI().isAppSectionInstalled(sectionData);
      return toMonitored('v3.publicApi.isAppSectionInstalled', action)();
    },
    openLightbox: (tpaPageId, data) => {
      const action = () => getPublicAPI().openLightbox(tpaPageId, data);
      return toMonitored('v3.publicApi.openLightbox', action)();
    },
    getInstalledLightboxes: () => {
      const action = () => getPublicAPI().getInstalledLightboxes();
      return toMonitored('v3.publicApi.getInstalledLightboxes', action)();
    },
  };
};
