import {
  BlocksConfig,
  WidgetControllerConfig,
} from '@wix/blocks-widget-services-types';
import {
  IWidgetModuleProvider,
  WidgetModuleArgs,
  WidgetModuleExports,
} from './IWidgetModuleProvider';
import parseBlocksConfig from '../utils/blocksConfigParser';
import { generateWidgetCodeUrl } from '../utils/urlBuilder';
import { assertModuleLoader } from '../utils/assertions';

interface Options {
  blocksConfig?: BlocksConfig;
}

export class AsyncRemoteWidgetAMDModuleProvider
  implements IWidgetModuleProvider
{
  private _blocksConfig: BlocksConfig;

  constructor(
    private controllerConfig: WidgetControllerConfig,
    options?: Options,
  ) {
    this._blocksConfig =
      options?.blocksConfig ?? parseBlocksConfig(controllerConfig.appParams);
  }

  getModule<T extends object>(widgetType: string) {
    const widgetCodeUrl = generateWidgetCodeUrl(widgetType, this._blocksConfig);

    return (globals: WidgetModuleArgs<T>) => {
      assertModuleLoader(this.controllerConfig.wixCodeApi);

      return this.controllerConfig.wixCodeApi.environment.network.importAMDModule<WidgetModuleExports>(
        widgetCodeUrl,
        {
          globals,
        },
      );
    };
  }
}
