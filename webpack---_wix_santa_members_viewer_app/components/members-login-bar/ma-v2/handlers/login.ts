import type {
  ContextProps,
  ContextServicesWithMAPrefix,
} from '../../../../types';

export const addLoginHandler = (
  contextProps: ContextProps,
  contextServices: ContextServicesWithMAPrefix,
) => {
  return contextProps.wixCodeApi.user.onLogin(async () => {
    await contextServices.stateService.fetchInitialData();

    contextServices.menuService.initializeMenuItems({
      ...contextServices.stateService,
      cacheService: contextServices.cacheService,
    });
  });
};
