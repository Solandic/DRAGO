import type { Experiments, IHttpClient } from '@wix/yoshi-flow-editor';

import { Experiment } from '../../constants';
import type { WixCodeApi } from '../../types';
import type { Page, PageId, PagesMap } from './page-mapper';

type ViewMode = WixCodeApi['window']['viewMode'];

export type PermittedPagesMap = Record<Page, boolean>;

interface Permission {
  id: string;
  context: string;
  resourceIds: string[];
}

interface ListPermissionsResponse {
  permissions: Permission[];
}

interface IsPermittedResponse {
  isPermitted: Record<PageId, boolean>;
}

export class GroupsService {
  private readonly adminGroupId = '00000000-0000-0000-0000-000000000001';
  private readonly restrictedPagesContext = 'Pages';
  private readonly permittedPagesExperiment =
    Experiment.RestrictedMemberPagePermissions;

  constructor(
    private httpClient: IHttpClient | null,
    private experiments: Experiments | null,
  ) {}

  async getPermittedPagesMap(pagesMap: PagesMap, viewMode: ViewMode) {
    const memberPagesIds = Object.values(pagesMap);

    if (!this.shouldFetchPermittedPages(memberPagesIds, viewMode)) {
      return {} as PermittedPagesMap;
    }

    const permission = await this.fetchRestrictedPagesPermission();

    if (!this.hasRestrictedPages(permission, memberPagesIds)) {
      return this.getPermittedPagesMapFallback(Object.keys(pagesMap), true);
    }

    const nonRestrictedPagesIds = this.getNonRestrictedPages(
      permission!,
      memberPagesIds,
    );
    const restrictedMemberPagesIds = this.getRestrictedMemberPages(
      permission!,
      memberPagesIds,
    );
    const restrictedPagesPermissions =
      await this.checkPermissionsForRestrictedPages(
        permission!.id,
        restrictedMemberPagesIds,
      );

    return this.toPermittedPagesMap(
      pagesMap,
      nonRestrictedPagesIds,
      restrictedPagesPermissions,
    );
  }

  private toPermittedPagesMap(
    pagesMap: PagesMap,
    nonRestrictedPagesIds: string[],
    restrictedPagesPermissions: IsPermittedResponse['isPermitted'],
  ) {
    return Object.entries(pagesMap).reduce<PermittedPagesMap>(
      (permittedPagesMap, [page, pageId]) => {
        return nonRestrictedPagesIds.includes(pageId)
          ? { ...permittedPagesMap, [page]: true }
          : {
              ...permittedPagesMap,
              [page]: restrictedPagesPermissions[pageId],
            };
      },
      {},
    );
  }

  private getRestrictedMemberPages(
    permission: Permission,
    memberPagesIds: PageId[],
  ) {
    return permission.resourceIds.filter((pageId) => {
      return memberPagesIds.includes(pageId);
    });
  }

  private getNonRestrictedPages(
    permission: Permission,
    memberPagesIds: PageId[],
  ) {
    return memberPagesIds.filter(
      (pageId) => !permission.resourceIds.includes(pageId),
    );
  }

  private getPermittedPagesMapFallback(ids: string[], fallbackValue: boolean) {
    return ids.reduce((map, key) => ({ ...map, [key]: fallbackValue }), {});
  }

  private async checkPermissionsForRestrictedPages(
    permissionId: string,
    restrictedMemberPagesIds: PageId[],
  ) {
    const requestUrl = `/_api/members-groups-web/v1/permissions/${permissionId}`;
    const requestOptions = { params: { resourceId: restrictedMemberPagesIds } };
    const permittedPagesMapFallback = this.getPermittedPagesMapFallback(
      restrictedMemberPagesIds,
      false,
    );
    const permittedPagesMap = await this.httpClient
      ?.get<IsPermittedResponse>(requestUrl, requestOptions)
      .then(({ data }) => data.isPermitted)
      .catch(() => null);

    return permittedPagesMap ?? permittedPagesMapFallback;
  }

  private async fetchRestrictedPagesPermission() {
    const requestUrl = `/_api/members-groups-web/v1/groups/${this.adminGroupId}/permissions`;
    const permissions = await this.httpClient
      ?.get<ListPermissionsResponse>(requestUrl)
      .then(({ data }) => data.permissions)
      .catch(() => null);

    return (
      permissions?.find(
        ({ context }) => this.restrictedPagesContext === context,
      ) ?? null
    );
  }

  private hasRestrictedPages(
    permission: Permission | null,
    memberPagesIds: PageId[],
  ) {
    return (
      !!permission?.resourceIds.length &&
      memberPagesIds.some((pageId) => permission.resourceIds.includes(pageId))
    );
  }

  private shouldFetchPermittedPages(
    memberPagesIds: PageId[],
    viewMode: ViewMode,
  ) {
    const memberPagePermissionsEnabled = this.experiments?.enabled(
      this.permittedPagesExperiment,
    );
    return (
      (memberPagePermissionsEnabled ?? false) &&
      memberPagesIds.length > 0 &&
      viewMode === 'Site'
    );
  }
}

export const initGroupsService = (
  httpClient: IHttpClient | null,
  experiments: Experiments | null,
) => new GroupsService(httpClient, experiments);
