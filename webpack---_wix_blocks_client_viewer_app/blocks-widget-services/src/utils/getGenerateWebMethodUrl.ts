import { ControllerConfig } from '@wix/blocks-widget-services-types';
import { generateBackendPackageWebMethodUrl } from '@wix/cloud-elementory-protocol';

export const getGenerateWebMethodUrl = (
  controllerConfig: ControllerConfig<{}, {}>,
) => {
  const packageImportName =
    controllerConfig.appParams.blocksData?.packageImportName;

  if (!packageImportName) {
    return;
  }

  return (methodName: string) =>
    generateBackendPackageWebMethodUrl(packageImportName, methodName);
};
