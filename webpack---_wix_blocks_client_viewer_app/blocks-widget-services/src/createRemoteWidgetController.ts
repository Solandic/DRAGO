import { createWidgetController } from './createWidgetController';
import {
  $W,
  ControllerConfig,
  WidgetConfig,
  WidgetMetaData,
} from '@wix/blocks-widget-services-types';
import { loadWidgetModule } from './utils/moduleLoader';
import { WidgetModule } from './services/IWidgetModuleProvider';
import { IElementorySupport } from '@wix/native-components-infra/dist/src/types/types';
import { getRemoteModuleParamsBase } from './getRemoteModuleParams';
import { isPanelControllerConfig } from './utils';
import { initBindPropsDatasets } from './low-code/widgets/initBindPropsDatasets';
import { experiments } from './common';

function addSiteRevisionHeader<T extends object, P extends object = {}>(
  controllerConfig: ControllerConfig<WidgetConfig<T>, P>,
  elementorySupport: IElementorySupport,
) {
  if (elementorySupport?.options?.headers?.['x-wix-site-revision']) {
    return;
  }

  const { revision } = controllerConfig.wixCodeApi.site;
  try {
    elementorySupport.options = elementorySupport.options ?? {};
    elementorySupport.options.headers = elementorySupport.options.headers ?? {};
    elementorySupport.options.headers['x-wix-site-revision'] = revision;
  } catch (e) {
    console.error('failed adding elementory support headers', e);
  }
}

function registerBehavior(
  $w: $W,
  role: string,
  event: string,
  callbackId: string,
  moduleExports: Record<string, Function>,
) {
  const eventCB = moduleExports[callbackId];

  if (!eventCB) {
    return;
  }

  const eventRegistrar = $w(`@${role}`)[event];

  if (!eventRegistrar) {
    console.error(`tried registering to invalid event ${event}`); // TODO: report to sentry
    return;
  }

  eventRegistrar(eventCB);
}

export async function createRemoteWidgetController<
  T extends object,
  P extends object = {},
>(
  controllerConfig: ControllerConfig<WidgetConfig<T>, P>,
  widgetMetaData: WidgetMetaData,
  widgetModule: WidgetModule<T>,
) {
  return createWidgetController(
    controllerConfig,
    widgetMetaData,
    async (extendedControllerConfig) => {
      const { $widget, config } = extendedControllerConfig;
      if (
        controllerConfig.appParams.blocksData?.packageImportName &&
        self.elementorySupport
      ) {
        addSiteRevisionHeader(controllerConfig, self.elementorySupport);
      }

      /**
       * This part is needed until we will have full support of App permissions override, that will allow us to get and
       * use the app instance directly
       */
      if (isPanelControllerConfig(extendedControllerConfig)) {
        extendedControllerConfig.appParams.instance =
          (await extendedControllerConfig.wixCodeApi.editor?.getAppInstance()) ||
          extendedControllerConfig.appParams.instance;
      }

      const remoteModuleParams = await getRemoteModuleParamsBase(
        controllerConfig,
        experiments.isOpen('specs.wb.loadWidgetModuleCodeUsingWixContext'),
      );
      const moduleExports = await loadWidgetModule({
        ...remoteModuleParams,
        widgetModule,
        $widget,
      });

      const widgetExports =
        widgetMetaData.functions?.reduce(
          (acc: Record<string, Function>, { name }) => {
            if (moduleExports[name]) {
              acc[name] = moduleExports[name];
            }

            return acc;
          },
          {},
        ) || {};

      return {
        pageReady(scoped$w) {
          const behaviors = widgetMetaData?.behaviors ?? config.behaviors ?? [];

          initBindPropsDatasets(controllerConfig, $widget);

          behaviors.forEach(({ role, event, callbackId }) => {
            registerBehavior(scoped$w, role, event, callbackId, moduleExports);
          });
        },
        exports: widgetExports,
      };
    },
    { shouldAddInternalApi: false },
  );
}
