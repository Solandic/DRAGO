import { type ControllerParams } from '@wix/yoshi-flow-editor';

import { getCommonServices } from '../../../../services/common-services';
import type { ContextProps, ContextServices } from '../../../../types';
import { MenuService } from '../services/menu';
import { StateService } from '../services/state';

type GetContextReturnType = {
  contextProps: ContextProps;
  contextServices: ContextServices;
};

export const getContext = (params: ControllerParams): GetContextReturnType => {
  const { flowAPI, controllerConfig } = params;
  const { wixCodeApi, appParams, $w } = controllerConfig;

  const contextProps = { $w, flowAPI, wixCodeApi, appParams };

  const { currentUserService, rolesService, cacheService, warmupDataService } =
    getCommonServices({ flowAPI, controllerConfig });

  const stateService = new StateService(contextProps, {
    currentUserService,
    cacheService,
    rolesService,
    warmupDataService,
  });

  const menuService = new MenuService($w, stateService, flowAPI.experiments);

  const contextServices = {
    currentUserService,
    cacheService,
    rolesService,
    menuService,
    stateService,
  };

  return {
    contextProps,
    contextServices,
  };
};
