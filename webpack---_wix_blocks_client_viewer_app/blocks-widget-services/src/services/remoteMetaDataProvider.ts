import {
  BlocksConfig,
  WidgetControllerConfig,
  WidgetMetaData,
} from '@wix/blocks-widget-services-types';
import { ILogger } from '../common/ILogger';
import parseBlocksConfig from '../utils/blocksConfigParser';
import { fetchRemoteMetaData } from '../utils/widgetDescriptorFetcher';
import { IMetaDataProvider } from './IMetaDataProvider';

interface Options {
  logger?: ILogger;
  blocksConfig?: BlocksConfig;
}
export class RemoteMetaDataProvider implements IMetaDataProvider {
  private _widgetMetaDataStore: Record<string, Promise<WidgetMetaData>> = {};
  private _blocksConfig: BlocksConfig;

  constructor(
    appParams: WidgetControllerConfig['appParams'],
    private _widgetControllersConfigs: WidgetControllerConfig[],
    private readonly options?: Options,
  ) {
    this._blocksConfig = options?.blocksConfig ?? parseBlocksConfig(appParams);
    this.preLoadWidgetMetaData();
  }

  private preLoadWidgetMetaData() {
    this._widgetControllersConfigs.forEach((widgetControllerConfig) => {
      const widgetType = widgetControllerConfig.config.type;

      if (!this._widgetMetaDataStore[widgetType]) {
        this._widgetMetaDataStore[widgetType] = fetchRemoteMetaData(
          widgetControllerConfig,
          this._blocksConfig,
          this.options?.logger,
        );
      }
    });
  }

  getMetaData(widgetType: string) {
    return this._widgetMetaDataStore[widgetType];
  }
}
