import {
  AsyncRemoteWidgetAMDModuleProvider,
  RemoteMetaDataProvider,
  RemoteWidgetModuleProvider,
  RemoteWidgetsLoader,
  BundledWidgetModuleProvider,
  isBlocksAppParams,
  ModuleProviderType,
} from '@wix/blocks-widget-services';
import {
  BlocksAppParams,
  BlocksConfig,
  WidgetControllerConfig,
} from '@wix/blocks-widget-services-types';
import { ILogger, experiments } from '@wix/blocks-widget-services/common';

const LEGACY_REVISION_PREFIX = 'legacy';

const isLegacyBlocksApp = (
  appParams: WidgetControllerConfig['appParams'],
): appParams is BlocksAppParams =>
  !appParams.baseUrls?.siteAssets && !!appParams.blocksData;

const createBlocksConfigFromLegacyAppData = (
  appParams: BlocksAppParams,
  metaSiteId: string,
): BlocksConfig => {
  const { wixCodeInstanceId, wixCodeGridId } = appParams.blocksData;

  return {
    appDefinitionId: appParams.appDefinitionId,
    code: {
      instanceId: wixCodeInstanceId,
      gridId: wixCodeGridId,
      experimentsQueryString:
        appParams.appData?.blocksConsumerData?.codeExperimentsQueryString || '', // Should be replaced with a type guard once WBL-2343 is done
    },
    metaSiteId,
    revision: `${LEGACY_REVISION_PREFIX}-${wixCodeGridId}`,
  };
};

const createLegacyRemoteWidgetsLoader = (
  controllersConfigs: WidgetControllerConfig[],
  appParams: BlocksAppParams,
  metaSiteId: string,
  {
    logger,
  }: {
    logger: ILogger;
  },
) => {
  const blocksConfig = createBlocksConfigFromLegacyAppData(
    appParams,
    metaSiteId,
  );

  const remoteMetaDataProvider = new RemoteMetaDataProvider(
    appParams,
    controllersConfigs,
    { logger, blocksConfig },
  );

  const remoteModuleProvider = createModuleProvider(
    controllersConfigs[0],
    blocksConfig,
  );

  return new RemoteWidgetsLoader(
    appParams,
    remoteMetaDataProvider,
    remoteModuleProvider,
  );
};

const createModuleProvider = (
  controllerConfig: WidgetControllerConfig,
  blocksConfig?: BlocksConfig,
) => {
  const moduleProviderType = getModuleProviderType(controllerConfig);
  switch (moduleProviderType) {
    case ModuleProviderType.BundledCodeModuleProvider:
      return new BundledWidgetModuleProvider(controllerConfig);
    case ModuleProviderType.AMDModuleProvider:
      return new AsyncRemoteWidgetAMDModuleProvider(controllerConfig, {
        blocksConfig,
      });
    case ModuleProviderType.DefaultModuleProvider:
      return new RemoteWidgetModuleProvider(controllerConfig.appParams, {
        blocksConfig,
      });
  }
};

const getModuleProviderType = (
  controllerConfig: WidgetControllerConfig,
): ModuleProviderType => {
  if (
    experiments.isOpen('specs.blocks-client.useBundledWidgetCode') &&
    isBlocksAppParams(controllerConfig.appParams) &&
    controllerConfig.appParams.appData?.blocksConsumerData.widgetBundleUrls
  ) {
    return ModuleProviderType.BundledCodeModuleProvider;
  }

  if (controllerConfig.wixCodeApi.environment?.network.importAMDModule) {
    return ModuleProviderType.AMDModuleProvider;
  }

  return ModuleProviderType.DefaultModuleProvider;
};

export const createRemoteWidgetsLoader = (
  controllersConfigs: WidgetControllerConfig[],
  {
    logger,
  }: {
    logger: ILogger;
  },
) => {
  const { appParams, platformAPIs } = controllersConfigs[0];

  if (isLegacyBlocksApp(appParams) && platformAPIs.bi?.metaSiteId) {
    console.info('Loading legacy blocks app');
    return createLegacyRemoteWidgetsLoader(
      controllersConfigs,
      appParams,
      platformAPIs.bi.metaSiteId,
      {
        logger,
      },
    );
  }

  const remoteMetaDataProvider = new RemoteMetaDataProvider(
    appParams,
    controllersConfigs,
    {
      logger,
    },
  );

  const moduleProvider = createModuleProvider(controllersConfigs[0]);

  return new RemoteWidgetsLoader(
    appParams,
    remoteMetaDataProvider,
    moduleProvider,
  );
};
