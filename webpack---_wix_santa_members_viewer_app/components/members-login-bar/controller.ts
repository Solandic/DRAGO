import { type CreateControllerFn } from '@wix/yoshi-flow-editor';

import type { ControllerConfig, FlowAPI } from '../../types';
import {
  isProfilePageBoBInstalled,
  isSettingsPageInstalled,
} from '../../utils/site';
import { controllerCurrentMA } from './current-ma';
import { controllerMAV2 } from './ma-v2';
import { controllerMAV3 } from './ma-v3';

const getIsMembersAreaV2FromControllerConfig = (
  controllerConfig: ControllerConfig,
) => {
  // @ts-expect-error
  return controllerConfig?.connections?.[0]?.config?.isMembersAreaV2;
};

const getLoginBarController = async (
  flowAPI: FlowAPI,
  controllerConfig: ControllerConfig,
) => {
  const [shouldUseV3Context, shouldUseV2Context] = await Promise.all([
    isSettingsPageInstalled(flowAPI.controllerConfig.wixCodeApi),
    isProfilePageBoBInstalled(flowAPI.controllerConfig.wixCodeApi),
  ]);

  if (shouldUseV3Context) {
    return controllerMAV3;
  }

  if (
    shouldUseV2Context ||
    getIsMembersAreaV2FromControllerConfig(controllerConfig)
  ) {
    return controllerMAV2;
  }

  return controllerCurrentMA;
};

const createController: CreateControllerFn = async (props) => {
  const loginBarController = await getLoginBarController(
    props.flowAPI,
    props.controllerConfig,
  );

  return loginBarController(props);
};

export default createController;
