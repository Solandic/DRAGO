import { type CreateControllerFn } from '@wix/yoshi-flow-editor';

import { globalAppState } from '../../../services/global-app-state';
import { getLoginBarMenu } from '../../../utils/login-bar-menu';
import { addLoginHandler } from './handlers';
import { getContext } from './viewer-controller/context';

export const controllerMAV3: CreateControllerFn = async (props) => {
  const { contextProps, contextServices } = getContext(props);
  const { environment } = contextProps.flowAPI;
  const { user } = contextProps.wixCodeApi;

  const { stateService, cacheService, menuService } = contextServices;
  const shouldRenderMenu = user.currentUser.loggedIn && !environment.isEditor;

  return {
    async pageReady() {
      if (shouldRenderMenu) {
        await stateService.fetchInitialData();

        menuService.initializeMenuItems({
          ...stateService,
          cacheService,
        });
      }

      addLoginHandler(contextProps, contextServices);

      globalAppState.setMembersLoginWidgets([
        ...globalAppState.getMembersLoginWidgets(),
        ...getLoginBarMenu(contextProps.$w),
      ]);
    },
  };
};
