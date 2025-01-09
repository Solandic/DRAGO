import {
  BlocksConfig,
  WidgetControllerConfig,
} from '@wix/blocks-widget-services-types';
import { loadWidgetModule } from '../utils/importScriptAsAmdModule';
import { IWidgetModuleProvider, WidgetModule } from './IWidgetModuleProvider';
import parseBlocksConfig from '../utils/blocksConfigParser';
import { generateWidgetCodeUrl } from '../utils/urlBuilder';

interface Options {
  blocksConfig?: BlocksConfig;
}

export class RemoteWidgetModuleProvider implements IWidgetModuleProvider {
  private _widgetModuleStore: Record<string, WidgetModule<object>> = {};
  private _blocksConfig: BlocksConfig;

  constructor(
    appParams: WidgetControllerConfig['appParams'],
    options?: Options,
  ) {
    this._blocksConfig = options?.blocksConfig ?? parseBlocksConfig(appParams);
  }

  getModule<T extends object>(widgetType: string) {
    const widgetCodeUrl = generateWidgetCodeUrl(widgetType, this._blocksConfig);

    if (!this._widgetModuleStore[widgetCodeUrl]) {
      this._widgetModuleStore[widgetCodeUrl] =
        loadWidgetModule<WidgetModule<object>>(widgetCodeUrl);
    }

    return this._widgetModuleStore[widgetCodeUrl] as WidgetModule<T>;
  }
}
