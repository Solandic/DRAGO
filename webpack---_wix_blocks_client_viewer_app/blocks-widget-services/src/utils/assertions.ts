import { IWixAPI } from '@wix/native-components-infra/dist/src/types/types';
import {
  RequiredKeys,
  BlocksAppParams,
  WidgetControllerConfig,
} from '@wix/blocks-widget-services-types';
import { isBlocksAppParams } from './blocksConfigParser';

export function assertModuleLoader(
  wixCodeApi: IWixAPI,
): asserts wixCodeApi is RequiredKeys<IWixAPI, 'environment'> {
  if (!wixCodeApi.environment?.network.importAMDModule) {
    throw new Error('importAMDModule is not defined');
  }
}

export function assertIsBlocksAppParamsWithWidgetBundleUrls(
  controllerConfig: WidgetControllerConfig,
): asserts controllerConfig is WidgetControllerConfig & {
  appParams: BlocksAppParams & {
    appData: {
      blocksConsumerData: {
        widgetBundleUrls: Record<string, string>;
      };
    };
  };
} {
  if (
    !isBlocksAppParams(controllerConfig.appParams) ||
    !controllerConfig.appParams.appData?.blocksConsumerData.widgetBundleUrls
  ) {
    throw new Error('not blocks app params with widget bundle urls');
  }
}

export function assertWixCodeApis(
  wixCodeApi: IWixAPI,
): asserts wixCodeApi is RequiredKeys<IWixAPI, 'environment' | 'site'> {
  if (!wixCodeApi) {
    throw new Error('missing wix code apis');
  }
}
