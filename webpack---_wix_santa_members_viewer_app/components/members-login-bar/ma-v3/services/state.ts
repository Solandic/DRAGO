import { action, makeObservable } from 'mobx';

import { INITIAL_WARMUP_DATA } from '../../../../constants';
import StateServiceBase from '../../../../services/state-service-base';
import type {
  ContextProps,
  StateContextServices,
  StateService as IStateService,
  StateServiceBase as IStateServiceBase,
} from '../../../../types';

type WarmupData = Pick<
  IStateService,
  'currentUser' | 'currentUserRoles' | 'routes' | 'notificationsCounter'
>;

export class StateService extends StateServiceBase implements IStateService {
  constructor(
    protected readonly contextProps: ContextProps,
    protected readonly contextServices: StateContextServices,
  ) {
    super(contextProps, contextServices);
    makeObservable<this, Exclude<keyof IStateService, keyof IStateServiceBase>>(
      this,
      {
        fetchInitialData: action,
      },
    );
  }

  async fetchInitialData() {
    const { isSSR } = this.contextProps.flowAPI.environment;
    if (isSSR) {
      await this.fetchDataWrapper();

      const { currentUser, currentUserRoles, routes, notificationsCounter } =
        this;
      return this.contextServices.warmupDataService.setData(
        INITIAL_WARMUP_DATA,
        JSON.stringify({
          currentUser,
          currentUserRoles,
          routes,
          notificationsCounter,
        }),
      );
    }

    const warmupDataJson =
      this.contextServices.warmupDataService.getData<string>(
        INITIAL_WARMUP_DATA,
      );
    const warmupData: WarmupData = warmupDataJson
      ? JSON.parse(warmupDataJson)
      : null;

    if (warmupData) {
      this.currentUser = warmupData.currentUser;
      this.currentUserRoles = warmupData.currentUserRoles;
      this.routes = warmupData.routes;
      this.notificationsCounter = warmupData.notificationsCounter;
      return;
    }

    return this.fetchDataWrapper();
  }

  private async fetchDataWrapper() {
    await this.fetchCurrentUser();
    await Promise.all([
      this.fetchRouteConfigurations(),
      this.fetchCurrentUserRoles(),
      this.fetchNotificationsCounters(),
    ]);
  }
}
