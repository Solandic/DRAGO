import { action, makeObservable, observable } from 'mobx';

import { INITIAL_WARMUP_DATA } from '../../../../constants';
import StateServiceBase from '../../../../services/state-service-base';
import type {
  ContextProps,
  StateContextServicesWithPage,
  StateServiceBase as IStateServiceBase,
  StateServiceWithMAPrefix as IStateServiceWithMAPrefix,
} from '../../../../types';

type WarmupData = Pick<
  IStateServiceWithMAPrefix,
  | 'currentUser'
  | 'currentUserRoles'
  | 'routes'
  | 'membersAreaPagePrefix'
  | 'notificationsCounter'
>;

export class StateService
  extends StateServiceBase<StateContextServicesWithPage>
  implements IStateServiceWithMAPrefix
{
  membersAreaPagePrefix = '';

  constructor(
    contextProps: ContextProps,
    contextServices: StateContextServicesWithPage,
  ) {
    super(contextProps, contextServices);
    makeObservable<
      this,
      Exclude<keyof IStateServiceWithMAPrefix, keyof IStateServiceBase>
    >(this, {
      membersAreaPagePrefix: observable,
      fetchMembersAreaPagePrefix: action,
      fetchInitialData: action,
    });
  }

  async fetchMembersAreaPagePrefix() {
    const { pageService } = this.contextServices;

    const membersAreaPagePrefix = await pageService.getMembersAreaPagePrefix();
    this.membersAreaPagePrefix = membersAreaPagePrefix.replace('/', '');
  }

  async fetchInitialData() {
    const { isSSR } = this.contextProps.flowAPI.environment;
    if (isSSR) {
      await this.fetchDataWrapper();

      const {
        currentUser,
        currentUserRoles,
        routes,
        membersAreaPagePrefix,
        notificationsCounter,
      } = this;
      return this.contextServices.warmupDataService.setData(
        INITIAL_WARMUP_DATA,
        JSON.stringify({
          currentUser,
          currentUserRoles,
          routes,
          membersAreaPagePrefix,
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
      this.membersAreaPagePrefix = warmupData.membersAreaPagePrefix;
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
      this.fetchMembersAreaPagePrefix(),
      this.fetchNotificationsCounters(),
    ]);
  }
}
