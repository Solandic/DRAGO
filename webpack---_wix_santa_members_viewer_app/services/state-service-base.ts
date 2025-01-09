import type { ActivityCounter } from '@wix/ambassador-members-v1-activity-counter/types';
import type { Member } from '@wix/ambassador-members-v1-member/types';
import { action, makeObservable, observable } from 'mobx';

import { Experiment } from '../constants';
import type {
  ContextProps,
  Nullable,
  RouteConfiguration,
  StateContextServices,
  StateServiceBase as IStateServiceBase,
} from '../types';
import { globalAppState } from './global-app-state';
import { getNumberOfUnseenNotificationsActivityCounter } from './ping-feed-service';

export default class StateServiceBase<
  T extends StateContextServices = StateContextServices,
> implements IStateServiceBase
{
  routes: RouteConfiguration[] = [];
  currentUser: Nullable<Member> = null;
  currentUserRoles: string[] = [];
  notificationsCounter: Nullable<ActivityCounter> = null;

  constructor(
    protected contextProps: ContextProps,
    protected contextServices: T,
  ) {
    this.contextProps = contextProps;
    this.contextServices = contextServices;

    makeObservable<this, keyof IStateServiceBase>(this, {
      routes: observable,
      currentUser: observable,
      currentUserRoles: observable,
      notificationsCounter: observable,
      fetchCurrentUser: action,
      fetchCurrentUserRoles: action,
      fetchRouteConfigurations: action,
      fetchNotificationsCounters: action,
    });
  }

  async fetchCurrentUser() {
    const { cacheService, currentUserService } = this.contextServices;
    if (cacheService.hasCurrentUser()) {
      this.currentUser = cacheService.getCurrentUser();
      return;
    }

    this.currentUser = await currentUserService.getCurrentUser();
    cacheService.setCurrentUser(this.currentUser!);
  }

  async fetchCurrentUserRoles() {
    const { cacheService, rolesService } = this.contextServices;
    if (cacheService.hasRoles()) {
      this.currentUserRoles = cacheService.getRoles();
      return;
    }

    this.currentUserRoles = await rolesService.getMemberRoles(
      this.currentUser?.id ?? null,
    );
    cacheService.setRoles(this.currentUserRoles!);
  }

  async fetchRouteConfigurations() {
    const { experiments } = this.contextProps.flowAPI;
    const { cacheService } = this.contextServices;
    if (cacheService.hasRoutes()) {
      this.routes = cacheService.getRoutes();
      return;
    }

    const controllerConfig = globalAppState.getGlobalControllerConfig();
    const isPublicAppDataEnabled = experiments.enabled(
      Experiment.EnablePublicAppData,
    );
    const appParams = controllerConfig?.appParams;
    const routesFromGlobalController = controllerConfig?.config?.routes;

    const routesFromPublicAppData = isPublicAppDataEnabled
      ? appParams?.publicData?.APP?.routes
      : undefined;

    this.routes = routesFromPublicAppData ?? routesFromGlobalController ?? [];

    cacheService.setRoutes(this.routes);
  }

  async fetchNotificationsCounters() {
    const { controllerConfig, experiments } = this.contextProps.flowAPI;
    const isEnabled = experiments.enabled(Experiment.EnableNotifications);

    if (!isEnabled) {
      return;
    }

    const notificationsCounter =
      await getNumberOfUnseenNotificationsActivityCounter({
        memberId: this.currentUser?.contactId!,
        metaSiteId: controllerConfig.platformAPIs.bi?.metaSiteId!,
        flowAPI: this.contextProps.flowAPI,
        wixCodeApi: this.contextProps.wixCodeApi,
      });

    this.notificationsCounter = notificationsCounter;
  }
}
