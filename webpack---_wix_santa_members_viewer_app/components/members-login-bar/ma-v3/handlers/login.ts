import type { ContextProps, ContextServices } from '../../../../types';

export const addLoginHandler = (
  contextProps: ContextProps,
  contextServices: ContextServices,
) => {
  return contextProps.wixCodeApi.user.onLogin(async () => {
    await contextServices.stateService.fetchInitialData();

    contextServices.menuService.initializeMenuItems({
      ...contextServices.stateService,
      cacheService: contextServices.cacheService,
    });
  });
};
