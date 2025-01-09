import { WidgetControllerConfig } from '@wix/blocks-widget-services-types';
import { createRemoteWidgetController } from '../createRemoteWidgetController';
import { IMetaDataProvider } from './IMetaDataProvider';
import { IWidgetModuleProvider } from './IWidgetModuleProvider';
import { RemoteWidgetModuleProvider } from './remoteWidgetModuleProvider';

export class RemoteWidgetsLoader {
  constructor(
    appParams: WidgetControllerConfig['appParams'],
    private _metaDataProvider: IMetaDataProvider,
    private _widgetModuleProvider: IWidgetModuleProvider = new RemoteWidgetModuleProvider(
      appParams,
    ),
  ) {}

  async loadWidget(widgetControllerConfig: WidgetControllerConfig) {
    const widgetType = widgetControllerConfig.config.type;

    const widgetModule = this._widgetModuleProvider.getModule(widgetType);

    const widgetMetaData = await this._metaDataProvider.getMetaData(widgetType);

    return createRemoteWidgetController(
      widgetControllerConfig,
      widgetMetaData,
      widgetModule,
    );
  }
}
