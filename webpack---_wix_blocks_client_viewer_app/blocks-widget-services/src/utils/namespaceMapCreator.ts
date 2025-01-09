import {
  ControllerConfig,
  NamespaceMap,
  PlatformAPIs,
  WixCodeAPI,
} from '@wix/blocks-widget-services-types';
import { buildNamespacesMap } from '@wix/wix-code-viewer-utils';
import { createApplicationNamespace } from './applicationNamespaceCreator';

const getSDKForNamespaces = <T extends object>(
  wixCodeApi: WixCodeAPI,
  platformAPIs: PlatformAPIs,
  controllerConfig: ControllerConfig<T>,
) => {
  const { storage } = platformAPIs;

  const application = createApplicationNamespace(controllerConfig);

  return { storage, application, ...wixCodeApi };
};

export function createNamespacesMap<T extends object>(
  wixCodeApi: WixCodeAPI,
  platformAPIs: PlatformAPIs,
  controllerConfig: ControllerConfig<T>,
): NamespaceMap {
  const sdkForNamespaces = getSDKForNamespaces(
    wixCodeApi,
    platformAPIs,
    controllerConfig,
  );
  const boundFetch = self.fetch.bind(self);

  return buildNamespacesMap(sdkForNamespaces, boundFetch);
}
