import { ModuleList } from '@wix/auto-frontend-module-registry';
import {
  ControllerConfig,
  WixCodeAPI,
} from '@wix/blocks-widget-services-types';
import { listPagesImportedNamespaces } from '@wix/ambassador-velo-apps-v1-page-imported-namespaces/http';
import parseBlocksConfig, {
  isBlocksAppParams,
  isBlocksPreviewAppParams,
} from './utils/blocksConfigParser';
import { META_SITE_APP_DEF_ID } from './constants';
import {
  PageImportedNamespaces,
  ListPagesImportedNamespacesRequest,
} from '@wix/ambassador-velo-apps-v1-page-imported-namespaces/types';
import { memoize } from 'lodash';

const MODULES_TO_LOAD_WARMUP_KEY = '$blocks-warmup-modules-to-load';

const fetchWixCodeNamespace = async <T extends object>(
  namespace: keyof WixCodeAPI,
  controllerConfig: ControllerConfig<T>,
) => {
  // TODO: Update IWidgetControllerConfig to have `platformApiProvider`
  return (controllerConfig as any).platformApiProvider.getPlatformApi(
    namespace,
  );
};

const fetchPagesImportedNamespaces = <T extends object>(
  controllerConfig: ControllerConfig<T>,
  params: ListPagesImportedNamespacesRequest,
): Promise<PageImportedNamespaces[]> => {
  const signedInstance = (
    controllerConfig.platformAPIs as any
  ).essentials.env.platformEnv.getAppToken(META_SITE_APP_DEF_ID);

  return controllerConfig.essentials.httpClient
    .request(listPagesImportedNamespaces(params), {
      signedInstance,
    })
    .then((response) => {
      return response.data.pagesImportedNamespaces || [];
    })
    .catch((e) => {
      console.error(e);
      return [];
    });
};

function getImportNamespacesParams<T extends object>(
  controllerConfig: ControllerConfig<T>,
): ListPagesImportedNamespacesRequest | undefined {
  const appParams = controllerConfig.appParams;

  if (isBlocksAppParams(appParams)) {
    const {
      code: { gridId: gridAppId },
      metaSiteId,
    } = parseBlocksConfig(appParams);

    return {
      metaSiteId,
      gridAppId,
    };
  }

  if (isBlocksPreviewAppParams(appParams)) {
    const blocksPreviewData = appParams.appData.blocksPreviewData;

    const { gridAppId, metaSiteId } = blocksPreviewData;

    return {
      gridAppId,
      metaSiteId,
    };
  }

  return;
}

const getGridAppCacheKey = (controllerConfig: ControllerConfig<{}>) => {
  const importNamespacesParams = getImportNamespacesParams(controllerConfig);
  return `${importNamespacesParams?.gridAppId};${importNamespacesParams?.metaSiteId}`;
};

export const getMemoizedDynamicPlatformApisFetcher = () =>
  memoize(getDynamicPlatformApis, getGridAppCacheKey);

const getRelevantModulesToLoad = async <T extends object>(
  controllerConfig: ControllerConfig<T>,
): Promise<string[]> => {
  const importNamespacesParams = getImportNamespacesParams(controllerConfig);

  if (!importNamespacesParams) {
    return [];
  }

  const warmedUpImportedModules =
    controllerConfig.wixCodeApi.window.warmupData.get(
      MODULES_TO_LOAD_WARMUP_KEY,
    );

  if (warmedUpImportedModules) {
    return warmedUpImportedModules;
  }

  const importedNamespacesPerPage = await fetchPagesImportedNamespaces(
    controllerConfig,
    importNamespacesParams,
  );

  const modulesToLoad = importedNamespacesPerPage
    .flatMap(({ importedNamespaces }) => importedNamespaces)
    .map((namespace) => namespace?.name)
    .filter(
      (moduleName): moduleName is string =>
        !!moduleName && ModuleList.includes(moduleName),
    );

  controllerConfig.wixCodeApi.window.warmupData.set(
    MODULES_TO_LOAD_WARMUP_KEY,
    modulesToLoad,
  );

  return modulesToLoad;
};

const shouldLoadAllDynamicModules = ({
  wixCodeApi,
  appParams,
}: ControllerConfig<{}, {}>) =>
  wixCodeApi.window.viewMode !== 'Site' && isBlocksPreviewAppParams(appParams);

const getDynamicPlatformApis = async (
  controllerConfig: ControllerConfig<{}, {}>,
) => {
  const modulesToImport = shouldLoadAllDynamicModules(controllerConfig)
    ? ModuleList
    : await getRelevantModulesToLoad(controllerConfig);

  const uniqueModules = [...new Set(modulesToImport)];
  const uniqueModulesWithoutPrefix = uniqueModules.map((namespace) => {
    return namespace.replace('wix-', '') as keyof WixCodeAPI;
  });

  const { wixCodeApi } = controllerConfig;

  return Object.fromEntries(
    (
      await Promise.allSettled(
        uniqueModulesWithoutPrefix.map(async (namespace) => {
          if (!wixCodeApi[namespace]) {
            return [
              namespace,
              await fetchWixCodeNamespace(namespace, controllerConfig),
            ] as const;
          }

          return;
        }),
      )
    )
      .filter(
        (result): result is PromiseFulfilledResult<[keyof WixCodeAPI, any]> =>
          result.status === 'fulfilled' &&
          !!result.value &&
          result.value[1] !== null,
      )
      .map((result) => {
        return result.value;
      }),
  );
};

export const memoizedDynamicPlatformApisFetcher = memoize(
  getDynamicPlatformApis,
  getGridAppCacheKey,
);
