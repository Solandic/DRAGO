import type { Experiments } from '@wix/yoshi-flow-editor';
import { action, makeObservable } from 'mobx';

import MenuServiceBase from '../../../../services/menu-service-base';
import type {
  I$WWrapper,
  MenuContext,
  MenuService as IMenuService,
  MenuServiceBase as IMenuServiceBase,
  StateService,
} from '../../../../types';

export class MenuService extends MenuServiceBase implements IMenuService {
  constructor(
    $w: I$WWrapper,
    stateService: StateService,
    experiments: Experiments,
  ) {
    super($w, stateService, experiments);
    makeObservable<this, Exclude<keyof IMenuService, keyof IMenuServiceBase>>(
      this,
      {
        initializeMenuItems: action,
      },
    );
  }

  initializeMenuItems(menuContext: MenuContext) {
    this.menuContext = menuContext;

    if (this.menuContext.cacheService.hasLoginMenuItems()) {
      this.menuItems = this.menuContext.cacheService.getLoginMenuItems();
      this.bindMenuItems();
      return;
    }

    this.filterMenuItemsVisibleForRoles();
    this.setNotificationsCount();
    this.menuContext.cacheService.setLoginMenuItems(this.menuItems);
    this.bindMenuItems();
  }
}
