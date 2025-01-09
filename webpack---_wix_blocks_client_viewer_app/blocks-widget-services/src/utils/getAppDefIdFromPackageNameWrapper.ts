import { CodePackage } from '@wix/blocks-widget-services-types';
import { getBackendPackageNameFromImportName } from '@wix/cloud-elementory-protocol';

const getAppDefIdFromPackageNameWrapper =
  (codePackagesData?: CodePackage[]) => (packageName: string) => {
    const packageDataForGivenName = codePackagesData?.find(
      ({ importName }) =>
        getBackendPackageNameFromImportName(importName) === packageName,
    );

    return packageDataForGivenName?.appDefId ?? null;
  };

export { getAppDefIdFromPackageNameWrapper };
