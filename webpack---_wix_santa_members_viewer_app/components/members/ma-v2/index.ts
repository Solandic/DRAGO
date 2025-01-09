import { type CreateControllerFn } from '@wix/yoshi-flow-editor';

import { globalAppState } from '../../../services/global-app-state';
import type { GlobalControllerConfig } from '../../../types';

export const controllerMAV2: CreateControllerFn = async ({
  controllerConfig,
}) => {
  const _controllerConfig = controllerConfig as GlobalControllerConfig;
  globalAppState.setGlobalControllerConfig(_controllerConfig);

  return {
    async pageReady() {
      // We could return controllerConfig here and take it in exports
      // Need to speak with viewer about this, because it's not typed and not documented...
    },
  };
};
