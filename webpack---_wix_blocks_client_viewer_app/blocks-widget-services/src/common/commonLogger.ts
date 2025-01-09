import type { PlatformServicesAPI } from '@wix/blocks-widget-services-types';
import type {
  ErrorMonitor,
  ErrorMonitorOptions,
} from '@wix/fe-essentials-viewer-platform/dist/types/exports/error-monitor';
import type { IFedOpsLogger } from '@wix/native-components-infra/dist/src/types/types';
import type { ILogger } from './ILogger';
import type { IAppIdentifier } from '@wix/fe-essentials-viewer-platform/fedops';
import { createFedopsLogger } from './fedopsCreator';

interface LoggerOptions {
  appDefId: string;
  errorMonitorOptions: ErrorMonitorOptions;
  fedOps?: {
    interactionPrefix?: string;
  };
}

// while we cannot use ExtraErrorData in essentials
// https://wix.slack.com/archives/C01K3J8KGBV/p1627219294005400
// istanbul ignore next
function getErrorContexts(error: any) {
  const errorContexts: Record<string, any> = {};

  try {
    if (error.originalError) {
      errorContexts[error.originalError.name] = {
        originalError: error.originalError,
      };
    }

    if (error.url) {
      errorContexts.url = {
        url: error.url,
      };
    }
  } catch (e) {
    console.error('failed retrieving extra context');
  }

  return errorContexts;
}

export class CommonLogger implements ILogger {
  private monitor!: ErrorMonitor;
  private fedOpsLogger!: IFedOpsLogger;
  private interactionPrefix!: string;

  static getCommonTags(platformServicesAPI: PlatformServicesAPI) {
    const {
      metaSiteId,
      isServerSide: isSSR,
      isPreview: isEditor,
      viewerName: viewer,
      viewMode,
      pageUrl,
      pageId,
    } = platformServicesAPI.bi;

    return { metaSiteId, isSSR, isEditor, viewer, viewMode, pageUrl, pageId };
  }

  init(
    { essentials, fedOpsLoggerFactory }: PlatformServicesAPI,
    { appDefId, errorMonitorOptions, fedOps }: LoggerOptions,
  ) {
    this.monitor = essentials.createErrorMonitor(errorMonitorOptions);
    this.fedOpsLogger = createFedopsLogger(appDefId, fedOpsLoggerFactory);
    this.interactionPrefix = fedOps?.interactionPrefix ?? '';
  }

  reportError(message: string, error: unknown) {
    console.error(message, error);
    const contexts = getErrorContexts(error);
    this.monitor.captureException(error as any, {
      contexts,
      tags: {
        groupingTag: message,
      },
    });
  }

  wrapWithErrorReporter<T extends unknown[], U>(
    fn: (...args: T) => U,
    message: string,
  ) {
    const logger = this;
    return function (...args: T) {
      try {
        return fn(...args);
      } catch (e) {
        logger.reportError(message, e);
        throw e;
      }
    };
  }

  interactionStarted(interactionName: string) {
    this.fedOpsLogger.interactionStarted(
      `${this.interactionPrefix}${interactionName}`,
    );
  }

  interactionEnded(interactionName: string) {
    this.fedOpsLogger.interactionEnded(
      `${this.interactionPrefix}${interactionName}`,
    );
  }

  appPhaseStarted(phaseName: string, params?: IAppIdentifier) {
    this.fedOpsLogger.appLoadingPhaseStart(
      `${this.interactionPrefix}${phaseName}`,
      params,
    );
  }

  appPhaseEnded(phaseName: string, params?: IAppIdentifier) {
    this.fedOpsLogger.appLoadingPhaseFinish(
      `${this.interactionPrefix}${phaseName}`,
      params,
    );
  }

  appLoadStarted() {
    this.fedOpsLogger.appLoadStarted();
  }

  appLoadEnded() {
    this.fedOpsLogger.appLoaded();
  }
}
