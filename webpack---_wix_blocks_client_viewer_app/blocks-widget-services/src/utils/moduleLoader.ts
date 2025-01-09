import {
  WidgetModule,
  WidgetModuleArgs,
} from '../services/IWidgetModuleProvider';

export type LoadWidgetModuleArgs<T extends object> = WidgetModuleArgs<T> & {
  widgetModule: WidgetModule<T>;
};

export function loadWidgetModule<T extends object>({
  widgetModule,
  $w,
  $widget,
  $ns,
  console,
  elementorySupport,
  getAppDefIdFromPackageName,
  generateWebMethodUrl,
  $wixContext,
  wixClient,
}: LoadWidgetModuleArgs<T>): ReturnType<WidgetModule<T>> {
  return widgetModule
    ? widgetModule({
        $w,
        $widget,
        $ns,
        console,
        elementorySupport,
        getAppDefIdFromPackageName,
        generateWebMethodUrl,
        ...($wixContext ? { $wixContext } : {}),
        ...(wixClient ? { wixClient } : {}),
      })
    : Promise.resolve({});
}
