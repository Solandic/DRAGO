import { ControllerConfig } from '@wix/blocks-widget-services-types';
import { RemoteModuleArgsBase } from './services/remoteModuleArgs';
import { getAppDefIdFromPackageNameWrapper } from './utils/getAppDefIdFromPackageNameWrapper';
import { getGenerateWebMethodUrl } from './utils/getGenerateWebMethodUrl';
import { createNamespacesMap } from './utils/namespaceMapCreator';
import { memoizedDynamicPlatformApisFetcher } from './getDynamicPlatformApis';
import { getWixContext } from './services/sdkProvider';

export const getRemoteModuleParamsBase = async <T extends object>(
  controllerConfig: ControllerConfig<T>,
  shouldCreateWixContext: boolean = false,
): Promise<RemoteModuleArgsBase> => {
  const { $w, wixCodeApi, platformAPIs } = controllerConfig;

  const apis = await memoizedDynamicPlatformApisFetcher(controllerConfig);

  const namespacesMap = createNamespacesMap(
    { ...wixCodeApi, ...apis },
    platformAPIs,
    controllerConfig,
  );

  const globalConsole = wixCodeApi.telemetry?.console ?? console;

  const generateWebMethodUrl = getGenerateWebMethodUrl(controllerConfig);

  controllerConfig?.wixCodeApi?.elementorySupport?.setHeader(
    'x-wix-app-instance',
    controllerConfig.appParams.instance,
  );

  const $wixContext = shouldCreateWixContext
    ? getWixContext(
        wixCodeApi,
        controllerConfig.appParams.appDefinitionId,
        controllerConfig.appParams.instance,
      )
    : undefined;

  return {
    $w,
    $ns: namespacesMap,
    console: globalConsole,
    elementorySupport: wixCodeApi.elementorySupport!,
    getAppDefIdFromPackageName: getAppDefIdFromPackageNameWrapper(
      (controllerConfig.appParams as any).codePackagesData, // https://github.com/wix-private/wix-blocks-client/pull/1838#discussion_r1037125449
    ),
    generateWebMethodUrl,
    ...($wixContext
      ? {
          $wixContext,
          wixClient: $wixContext.client,
        }
      : {}),
  };
};
