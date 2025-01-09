import { PlatformServicesAPI } from '@wix/blocks-widget-services-types';

export const createFedopsLogger = (
  appId: string,
  fedopsLoggerFactory: PlatformServicesAPI['fedOpsLoggerFactory'],
) =>
  fedopsLoggerFactory.getLoggerForWidget({
    appId,
    appName: appId,
    phasesConfig: 'SEND_START_AND_FINISH',
  });
