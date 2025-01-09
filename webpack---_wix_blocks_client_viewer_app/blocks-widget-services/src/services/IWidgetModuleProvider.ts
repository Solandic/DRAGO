import { $Widget } from '@wix/blocks-widget-services-types';
import { RemoteModuleArgsBase } from './remoteModuleArgs';
import { type WixClient } from '@wix/sdk';

export type WidgetModuleArgs<T extends object> = {
  $widget: $Widget<T>;
  $wixContext?: WixContext;
  wixClient?: WixClient;
} & RemoteModuleArgsBase;

export type WidgetModuleExports = Record<string, Function>;

export type WixContext = {
  version: number;
  client: WixClient;
  clientSdk: ClientSdk;
};
export type WidgetModule<T extends object> = (
  args: WidgetModuleArgs<T>,
) => Promise<WidgetModuleExports>;

export interface IWidgetModuleProvider {
  getModule: <T extends object>(widgetType: string) => WidgetModule<T>;
}

export type ClientSdk = {
  invoke: (args: {
    applicationId: string;
    namespace: string;
    method: string;
    args: any[];
  }) => Promise<void>;
};

export enum ModuleProviderType {
  BundledCodeModuleProvider,
  AMDModuleProvider,
  DefaultModuleProvider,
}
