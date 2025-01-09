import { type CreateControllerFn } from '@wix/yoshi-flow-editor';

import type { FlowAPI } from '../../types';
import {
  isProfilePageBoBInstalled,
  isSettingsPageInstalled,
} from '../../utils/site';
import { controllerCurrentMA } from './current-ma';
import { controllerMAV2 } from './ma-v2';
import { controllerMAV3 } from './ma-v3';

const getGlobalController = async (flowAPI: FlowAPI) => {
  const [shouldUseV3Context, shouldUseV2Context] = await Promise.all([
    isSettingsPageInstalled(flowAPI.controllerConfig.wixCodeApi),
    isProfilePageBoBInstalled(flowAPI.controllerConfig.wixCodeApi),
  ]);

  if (shouldUseV3Context) {
    return controllerMAV3;
  }

  if (shouldUseV2Context) {
    return controllerMAV2;
  }

  return controllerCurrentMA;
};

const createController: CreateControllerFn = async (props) => {
  const globalController = await getGlobalController(props.flowAPI);
  return globalController(props);
};

export default createController;
