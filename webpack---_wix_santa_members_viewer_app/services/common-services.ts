import { type ControllerParams } from '@wix/yoshi-flow-editor';

import { CurrentUserService } from './current-user';
import { CacheService } from './memory-cache';
import { RolesService } from './roles';
import { WarmupDataService } from './warmup-data';

export const getCommonServices = ({
  flowAPI,
  controllerConfig: { platformAPIs, wixCodeApi, appParams },
}: Pick<ControllerParams, 'flowAPI' | 'controllerConfig'>) => {
  const currentUserService = new CurrentUserService(flowAPI.httpClient);

  const rolesService = new RolesService(flowAPI.httpClient);

  const cacheService = new CacheService(
    platformAPIs.storage.memory,
    wixCodeApi.site,
    appParams.appDefinitionId,
  );

  const warmupDataService = new WarmupDataService(wixCodeApi.window.warmupData);

  return {
    currentUserService,
    rolesService,
    cacheService,
    warmupDataService,
  };
};
