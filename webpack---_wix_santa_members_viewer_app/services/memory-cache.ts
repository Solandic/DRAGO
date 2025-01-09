import type { Member } from '@wix/ambassador-members-v1-member/types';
import type { IPlatformAPI, ISiteApis } from '@wix/yoshi-flow-editor';

import type {
  CacheService as ICacheService,
  MenuItem,
  RouteConfiguration,
} from '../types';

export class CacheService implements ICacheService {
  constructor(
    private readonly memoryStorage: IPlatformAPI['storage']['memory'],
    private readonly site: ISiteApis,
    private readonly appDefId: string,
  ) {}

  hasCurrentUser() {
    const cacheKey = this.getCurrentUserCacheKey();
    return this.hasItemInStorage(cacheKey);
  }

  getCurrentUser() {
    const cacheKey = this.getCurrentUserCacheKey();
    return this.getItemFromStorage<Member>(cacheKey);
  }

  setCurrentUser(currentUser: Member) {
    const cacheKey = this.getCurrentUserCacheKey();
    return this.setItemToStorage(cacheKey, currentUser);
  }

  hasRoles() {
    const cacheKey = this.getRolesCacheKey();
    return this.hasItemInStorage(cacheKey);
  }

  getRoles() {
    const cacheKey = this.getRolesCacheKey();
    return this.getItemFromStorage<string[]>(cacheKey) ?? [];
  }

  setRoles(rolesMap: string[]) {
    const cacheKey = this.getRolesCacheKey();
    return this.setItemToStorage(cacheKey, rolesMap);
  }

  hasRoutes() {
    const cacheKey = this.getRoutesCacheKey();
    return this.hasItemInStorage(cacheKey);
  }

  getRoutes() {
    const cacheKey = this.getRoutesCacheKey();
    return this.getItemFromStorage<RouteConfiguration[]>(cacheKey) ?? [];
  }

  setRoutes(routes: RouteConfiguration[]) {
    const cacheKey = this.getRoutesCacheKey();
    return this.setItemToStorage(cacheKey, routes);
  }

  hasLoginMenuItems() {
    const cacheKey = this.getLoginBarMenuCacheKey();
    return this.hasItemInStorage(cacheKey);
  }

  getLoginMenuItems() {
    const cacheKey = this.getLoginBarMenuCacheKey();
    return this.getItemFromStorage<MenuItem[]>(cacheKey) ?? [];
  }

  setLoginMenuItems(menuItems: MenuItem[]) {
    const cacheKey = this.getLoginBarMenuCacheKey();
    return this.setItemToStorage(cacheKey, menuItems);
  }

  private getRoutesCacheKey() {
    return `members-routes-${this.site.getAppToken?.(this.appDefId)}`;
  }

  private getRolesCacheKey() {
    return `members-roles-${this.site.getAppToken?.(this.appDefId)}`;
  }

  private getCurrentUserCacheKey() {
    return `members-cu-${this.site.getAppToken?.(this.appDefId)}`;
  }

  private getLoginBarMenuCacheKey() {
    return `members-login-bar-${this.site.getAppToken?.(this.appDefId)}`;
  }

  private hasItemInStorage(cacheKey: string) {
    const item = this.memoryStorage.getItem(cacheKey);
    return !!item;
  }

  private getItemFromStorage<T>(cacheKey: string): T | null {
    const item = this.memoryStorage.getItem(cacheKey);
    return item ? (JSON.parse(item) as T) : null;
  }

  private setItemToStorage<T>(cacheKey: string, item: T) {
    return this.memoryStorage.setItem(cacheKey, JSON.stringify(item));
  }
}
