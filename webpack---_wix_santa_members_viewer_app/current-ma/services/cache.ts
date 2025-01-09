import type {
  Member,
  MemoryStorage,
  Numbers,
  OldCacheService,
  RolesMap,
  Storage,
} from '../../types';

class InMemoryCacheService implements OldCacheService {
  constructor(private readonly storage: MemoryStorage) {}

  hasCurrentUser(instance: string) {
    const cacheKey = this.getCurrentUserCacheKey(instance);
    return this.hasItemInStorage(cacheKey);
  }

  getCurrentUser(instance: string) {
    const cacheKey = this.getCurrentUserCacheKey(instance);
    return this.getItemFromStorage<Member>(cacheKey);
  }

  setCurrentUser(instance: string, currentUser: Member) {
    const cacheKey = this.getCurrentUserCacheKey(instance);
    return this.setItemToStorage(cacheKey, currentUser);
  }

  hasViewedUser(instance: string, viewedUserId: string) {
    const cacheKey = this.getViewedUserCacheKey(instance, viewedUserId);
    return this.hasItemInStorage(cacheKey);
  }

  getViewedUser(instance: string, viewedUserId: string) {
    const cacheKey = this.getViewedUserCacheKey(instance, viewedUserId);
    return this.getItemFromStorage<Member>(cacheKey);
  }

  setViewedUser(instance: string, viewedUserId: string, viewedUser: Member) {
    const cacheKey = this.getViewedUserCacheKey(instance, viewedUserId);
    return this.setItemToStorage(cacheKey, viewedUser);
  }

  hasRoles(instance: string, viewedUserId: string | undefined) {
    const cacheKey = this.getRolesCacheKey(instance, viewedUserId);
    return this.hasItemInStorage(cacheKey);
  }

  getRoles(instance: string, viewedUserId: string | undefined) {
    const cacheKey = this.getRolesCacheKey(instance, viewedUserId);
    return this.getItemFromStorage<RolesMap>(cacheKey);
  }

  setRoles(
    instance: string,
    viewedUserId: string | undefined,
    rolesMap: RolesMap,
  ) {
    const cacheKey = this.getRolesCacheKey(instance, viewedUserId);
    return this.setItemToStorage(cacheKey, rolesMap);
  }

  hasNumbers(instance: string, userId: string) {
    const cacheKey = this.getNumbersCacheKey(instance, userId);
    return this.hasItemInStorage(cacheKey);
  }

  getNumbers(instance: string, userId: string) {
    const cacheKey = this.getNumbersCacheKey(instance, userId);
    return this.getItemFromStorage<Numbers>(cacheKey);
  }

  setNumbers(instance: string, userId: string, numbers: unknown) {
    const cacheKey = this.getNumbersCacheKey(instance, userId);
    return this.setItemToStorage(cacheKey, numbers);
  }

  private hasItemInStorage(cacheKey: string) {
    const item = this.storage.getItem(cacheKey);
    return !!item;
  }

  private getItemFromStorage<T>(cacheKey: string): T | null {
    const item = this.storage.getItem(cacheKey);
    return item ? (JSON.parse(item) as T) : null;
  }

  private setItemToStorage<T>(cacheKey: string, item: T) {
    return this.storage.setItem(cacheKey, JSON.stringify(item));
  }

  private getCurrentUserCacheKey(instance: string) {
    return `cu-${instance}`;
  }

  private getViewedUserCacheKey(instance: string, viewedUserId: string) {
    return `vu-${viewedUserId}-${instance}`;
  }

  private getRolesCacheKey(instance: string, viewedUserId: string | undefined) {
    return viewedUserId
      ? `roles-${viewedUserId}-${instance}`
      : `roles-${instance}`;
  }

  private getNumbersCacheKey(instance: string, userId: string) {
    return `numbers-${userId}-${instance}`;
  }
}

export const initInMemoryCacheService = (storage: Storage) => {
  return new InMemoryCacheService(storage.memory);
};
