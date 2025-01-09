import {
  IWidgetModuleProvider,
  WidgetModuleArgs,
  WidgetModule,
} from './IWidgetModuleProvider';
import { loadBundledCode } from '../utils/importScriptBundledCodeModule';
import { WidgetControllerConfig } from '@wix/blocks-widget-services-types';
import {
  assertIsBlocksAppParamsWithWidgetBundleUrls,
  assertWixCodeApis,
} from '../utils/assertions';

export class BundledWidgetModuleProvider implements IWidgetModuleProvider {
  private _widgetBundleUrls: Record<string, string>;

  constructor(controllerConfig: WidgetControllerConfig) {
    assertIsBlocksAppParamsWithWidgetBundleUrls(controllerConfig);
    assertWixCodeApis(controllerConfig.wixCodeApi);

    this._widgetBundleUrls =
      controllerConfig.appParams.appData.blocksConsumerData.widgetBundleUrls;
  }

  getModule<T extends object>(widgetType: string) {
    const widgetCodeUrl = this._widgetBundleUrls[widgetType];

    return async (globals: WidgetModuleArgs<T>) => {
      const { init } = await loadBundledCode<WidgetModule<object>>(
        widgetCodeUrl,
      );

      return init({
        ...globals,
        wixClient: globals.$wixContext?.client,
      });
    };
  }
}
