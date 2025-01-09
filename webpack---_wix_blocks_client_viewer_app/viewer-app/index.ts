import {
  BlocksAppParams,
  PlatformAPIs,
  PlatformServicesAPI,
  WidgetControllerConfig,
  WixCodeAPI,
} from '@wix/blocks-widget-services-types';
import { CommonLogger, experiments } from '@wix/blocks-widget-services/common';
import constants from './constants';
import { createRemoteWidgetsLoader } from './remoteWidgetsLoaderCreator';

const emptyController = {
  pageReady() {},
  exports() {
    return {};
  },
};

function createApp() {
  /**
   * When a site contains multiple blocks apps, this module is being created just once,
   * so we need this in order to pass the correct logger from initAppToPage to createControllers.
   * until this will happen https://jira.wixpress.com/browse/PLAT-1567
   */
  const appToLoggerMap = new Map<string, CommonLogger>();

  const initAppForPage = async (
    appParams: BlocksAppParams,
    _: PlatformAPIs,
    wixCodeApi: WixCodeAPI,
    platformServicesAPI: PlatformServicesAPI,
  ) => {
    const { appDefinitionId } = appParams;

    const logger = new CommonLogger();

    logger.init(platformServicesAPI, {
      appDefId: constants.APP_DEF_ID,
      errorMonitorOptions: {
        dsn: constants.SENTRY.DSN,
        environment: process.env.NODE_ENV,
        version: process.env.ARTIFACT_VERSION,
        appName: process.env.ARTIFACT_ID,
        tags: {
          appDefId: appDefinitionId,
          ...CommonLogger.getCommonTags(platformServicesAPI),
        },
      },
      fedOps: {
        interactionPrefix: constants.LOGGER.PREFIX,
      },
    });

    logger.appLoadStarted();
    appToLoggerMap.set(appDefinitionId, logger);

    await experiments.init({
      scope: constants.EXPERIMENTS_SCOPE,
      wixCodeApi,
      platformServicesAPI,
      preloadedExperiments: appParams.appData?.blocksConsumerData?.experiments,
      logger,
    });
  };

  const createControllersImpl = (
    widgetControllersConfigs: WidgetControllerConfig[],
    logger: CommonLogger,
  ) => {
    logger.interactionStarted(constants.INTERACTIONS.CREATE_CONTROLLERS);
    const remoteWidgetsLoader = createRemoteWidgetsLoader(
      widgetControllersConfigs,
      {
        logger,
      },
    );

    const controllersMap = widgetControllersConfigs.map(
      async (widgetControllerConfig) => {
        try {
          const dcWidgetId = widgetControllerConfig.config.devCenterWidgetId;
          const { appDefinitionId } = widgetControllerConfig.appParams;
          logger.interactionStarted(
            `${constants.PHASES.LOAD_WIDGET}_${dcWidgetId}`,
          );
          logger.appPhaseStarted(constants.PHASES.LOAD_WIDGET, {
            appId: appDefinitionId,
            widgetId: dcWidgetId,
          });

          const widget = await remoteWidgetsLoader.loadWidget(
            widgetControllerConfig,
          );

          logger.appPhaseEnded(constants.PHASES.LOAD_WIDGET, {
            appId: appDefinitionId,
            widgetId: dcWidgetId,
          });
          logger.interactionEnded(
            `${constants.PHASES.LOAD_WIDGET}_${dcWidgetId}`,
          );

          return widget;
        } catch (e) {
          logger.reportError('Failed loading widget', e);
          return emptyController;
        }
      },
    );

    Promise.all(controllersMap).then(() => {
      logger.interactionEnded(constants.INTERACTIONS.CREATE_CONTROLLERS);
      logger.appLoadEnded();
    });

    return controllersMap;
  };

  const createControllers = (
    widgetControllersConfigs: WidgetControllerConfig[],
  ) => {
    if (widgetControllersConfigs.length === 0) {
      return [];
    }

    const { appParams } = widgetControllersConfigs[0];

    const logger = appToLoggerMap.get(appParams.appDefinitionId);

    /* istanbul ignore next */
    if (!logger) {
      /**
       * If this happened, it means that something strange happened in viewer platform and either
       * a) createControllers was called without initAppForPage
       * b) createControllers was called with a different appDefId then initAppForPage
       */
      throw new Error('Failed to initialize Blocks app');
    }

    return logger.wrapWithErrorReporter(
      createControllersImpl,
      'Failed running create controllers',
    )(widgetControllersConfigs, logger);
  };

  return {
    initAppForPage,
    createControllers,
  };
}

export const { initAppForPage, createControllers } = createApp();
