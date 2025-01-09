import { getRoles as getMemberRoles } from '@wix/ambassador-members-v1-role/http';
import type {
  IHttpClient,
  IPlatformServices,
  ViewerScriptFlowAPI,
} from '@wix/yoshi-flow-editor';

import { USER_NAME_PATTERN } from '../../constants';
import type {
  GetMyMemberResponse,
  Member,
  MemberData,
  RolesMap,
  WixCodeApi,
} from '../../types';
import { logError } from '../../utils/monitoring';
import type { MemberActivityCounters } from './activity-counters-service';
import { getMemberActivityCounters } from './activity-counters-service';
import { HttpClientService } from './httpClient';
import { getMemoryStorage } from './memory-storage';

const CURRENT_USER_SLUG_STORAGE_KEY = 'current-user-slug';
const CURRENT_USER_ID_STORAGE_KEY = 'current-user-id';

export function createUserService(
  wixCodeApi: WixCodeApi,
  biService: IPlatformServices['bi'],
  flowAPI: ViewerScriptFlowAPI,
) {
  let viewedUser: Member, currentUser: Member, userRoles: RolesMap;

  function fetchMenuCounters(
    user: Member,
  ): Promise<{ apps: MemberActivityCounters }> {
    if (!user || user.loggedIn === false) {
      return Promise.resolve({ apps: [] });
    }
    return new Promise<{ apps: MemberActivityCounters }>((resolve, reject) => {
      const userId = user && user.id;
      if (userId) {
        getMemberActivityCounters({
          memberId: userId,
          loggedIn: !!user.loggedIn,
          biService,
          flowAPI,
          wixCodeApi,
        }).then((response) => resolve({ apps: response }));
      } else {
        reject(new Error('No user to get menu counters by'));
      }
    });
  }

  async function fetchRoles(
    viewedUserId: string,
    loggedInUserId: string,
    httpClient: IHttpClient,
  ): Promise<RolesMap> {
    const [viewedRoleResponse, loggedInRoleResponse] = await Promise.all([
      viewedUserId
        ? httpClient
            .request(getMemberRoles({ memberId: viewedUserId }))
            .catch(() => undefined)
        : undefined,
      loggedInUserId
        ? httpClient
            .request(getMemberRoles({ memberId: loggedInUserId }))
            .catch(() => undefined)
        : undefined,
    ]);

    return {
      ...(viewedRoleResponse && {
        [viewedUserId]:
          viewedRoleResponse?.data?.roles?.map(
            (role) => role.roleKey?.toLocaleLowerCase()!,
          ) || [],
      }),
      ...(loggedInRoleResponse && {
        [loggedInUserId]:
          loggedInRoleResponse?.data?.roles?.map(
            (role) => role.roleKey?.toLocaleLowerCase()!,
          ) || [],
      }),
    };
  }

  function replaceUserPatternWithSlug(url: string, user: Member) {
    return url
      .replace(USER_NAME_PATTERN, user.slug)
      .replace(encodeURI(USER_NAME_PATTERN), user.slug);
  }

  function getViewedUser() {
    return viewedUser ?? {};
  }

  function getCurrentUser() {
    return currentUser ?? {};
  }

  function getRoles() {
    return userRoles ?? {};
  }

  function setRoles(roles: RolesMap) {
    userRoles = roles;
  }

  function setViewedUser(userData: Member) {
    if (userData) {
      viewedUser = userData;
    }
  }

  async function setCurrentUser(userData: MemberData, httpClient: IHttpClient) {
    const slug = await getCurrentUserSlug(userData, httpClient);

    currentUser = {
      id: userData.id,
      loggedIn: userData.loggedIn,
      slug: slug as string,
    };
  }

  async function fetchCurrentUserSlug(httpClient: IHttpClient) {
    const httpClientService = new HttpClientService(httpClient);
    const response = await httpClientService.get<GetMyMemberResponse>(
      '/_api/members/v1/members/my',
    );
    return (response as GetMyMemberResponse).member?.profile?.slug;
  }

  function getCurrentUserSlug(userData: MemberData, httpClient: IHttpClient) {
    const memoryStorage = getMemoryStorage();
    const storageSlug = memoryStorage.getItem(CURRENT_USER_SLUG_STORAGE_KEY);
    const currentUserId = memoryStorage.getItem(CURRENT_USER_ID_STORAGE_KEY);

    if (storageSlug && currentUserId === userData.id) {
      return storageSlug;
    }

    if (!currentUserId || currentUserId !== userData.id) {
      memoryStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, userData.id);
    }

    if (!userData.loggedIn || wixCodeApi.window.viewMode !== 'Site') {
      return userData.id;
    }

    // Calling manually instead of userData.loggedIn.getSlug to not depend on their implementation
    // This was applied as a hotfix because of broken userData.loggedIn.getSlug implementation
    return fetchCurrentUserSlug(httpClient)
      .then((slug: string) => {
        const finalSlug = slug || userData.id;
        memoryStorage.setItem(CURRENT_USER_SLUG_STORAGE_KEY, finalSlug);
        return finalSlug;
      })
      .catch(() =>
        logError('Error while fetching current user slug', {
          userDataId: userData.id,
        }),
      );
  }

  return {
    getCurrentUser,
    setCurrentUser,
    getViewedUser,
    setViewedUser,
    fetchRoles,
    getRoles,
    setRoles,
    fetchMenuCounters,
    replaceUserPatternWithSlug,
  };
}

export type UserService = ReturnType<typeof createUserService>;
