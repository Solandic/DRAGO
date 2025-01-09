import { isNil, isPlainObject, noop } from 'lodash';
import {
  ExtendedControllerConfig,
  WidgetConfig,
  WidgetMetaData,
  $W,
  Controller,
  ControllerWithExportsFunction,
  ControllerConfig,
  CreateEventFN,
} from '@wix/blocks-widget-services-types';
import { pascalCase } from './utils/stringUtils';
import { createWidgetServices, WidgetEventPayload } from './widgetServices';
import { WidgetCreationError } from './errors/widgetCreationError';
import { isBlocksAppParams } from './utils';

type CreateEventAdapter = (event: WidgetEventPayload) => unknown;

function getCreateEventFN(
  $w: $W,
  createEvent?: CreateEventFN,
): CreateEventAdapter {
  return (event: WidgetEventPayload) => {
    if (createEvent) {
      return createEvent(event);
    }

    const { type, ...data } = event;

    return $w.createEvent(type, data);
  };
}

function withEventListeners(
  widgetApi: Record<string, any>,
  widgetMetaData: WidgetMetaData,
  $w: $W,
  createEvent: CreateEventAdapter,
) {
  widgetMetaData.events?.forEach(({ name }) => {
    widgetApi[`on${pascalCase(name)}`] = (cb: Function) =>
      $w.on(name, (event: WidgetEventPayload) => cb(createEvent(event)));
  });

  return widgetApi;
}

function mergeProps<T extends object>(
  baseProps: object = {},
  overrideProps: object,
): T {
  if (!overrideProps) {
    return baseProps as T;
  }

  const keys = [
    ...new Set([...Object.keys(baseProps), ...Object.keys(overrideProps)]),
  ];

  return keys.reduce((mergedProps, propKey) => {
    const baseValue = baseProps[propKey as keyof typeof baseProps];
    const overrideValue = overrideProps[propKey as keyof typeof baseProps];

    if (isPlainObject(baseValue)) {
      mergedProps[propKey as keyof typeof baseProps] = mergeProps(
        baseValue,
        overrideValue,
      );
    } else {
      mergedProps[propKey as keyof T] = isNil(baseValue)
        ? overrideValue
        : baseValue;
    }
    return mergedProps;
  }, {} as T);
}

const normalizeDefaultProps = <T extends object>(
  defaultProps: WidgetMetaData['properties'] = [],
): T => {
  return defaultProps.reduce((normalizedObj, { name, defaultValue }) => {
    normalizedObj[name as keyof T] = defaultValue;

    return normalizedObj;
  }, {} as T);
};

export type CreateWidgetFN<T extends object, P extends object = {}> = (
  extendedControllerConfig: ExtendedControllerConfig<T, P>,
) => Controller<Record<string, any>> | Promise<Controller<Record<string, any>>>;

function shouldInvokePropsChangedOnUpdateConfig<
  T extends object,
  P extends object = {},
>({ appParams }: ControllerConfig<WidgetConfig<T>, P>): boolean | undefined {
  if (isBlocksAppParams(appParams)) {
    return appParams.appData?.blocksConsumerData
      ?.invokePropsChangedOnUpdateConfig;
  }

  return false;
}

export async function createWidgetController<
  T extends object,
  P extends object = {},
>(
  controllerConfig: ControllerConfig<WidgetConfig<T>, P>,
  widgetMetaData: WidgetMetaData,
  createWidgetFn: CreateWidgetFN<T, P>,
  options: {
    shouldAddInternalApi: boolean;
  } = {
    shouldAddInternalApi: true,
  },
): Promise<ControllerWithExportsFunction<Record<string, any>>> {
  const { $w, config } = controllerConfig;

  const normalizedDefaultProps = normalizeDefaultProps<T>(
    widgetMetaData.properties,
  );
  const mergedProps = mergeProps<T>(config.props, normalizedDefaultProps);

  const { generate$widget, generateWidgetAPI, setProps } = createWidgetServices(
    mergedProps,
    options.shouldAddInternalApi,
  );
  const $widget = generate$widget($w);

  let customPageReady = noop;
  let moduleExports = {};
  let updateWidgetViewState;
  let getWidgetViewStateAfterRefresh;

  try {
    const widgetController = await createWidgetFn({
      $widget,
      ...controllerConfig,
    });

    customPageReady = widgetController?.pageReady;
    moduleExports = widgetController?.exports;
    updateWidgetViewState = widgetController?.updateWidgetViewState;
    getWidgetViewStateAfterRefresh =
      widgetController?.getWidgetViewStateAfterRefresh;
  } catch (e) {
    throw new WidgetCreationError(e);
  }

  const widgetApiFactory = (createEvent?: CreateEventFN) => {
    const initialWidgetApi = generateWidgetAPI($widget, moduleExports);
    return withEventListeners(
      initialWidgetApi,
      widgetMetaData,
      $w,
      getCreateEventFN($w, createEvent),
    );
  };

  const updateConfig = (_scoped$w: $W, newConfig: any) => {
    // We assume that newConfig.props is undefined if the widget was reset
    // In this case we should reset the props to the default values
    // Otherwise we should merge the new props with the existing ones
    const props = newConfig.props
      ? mergeProps<T>(newConfig.props, $widget.props)
      : normalizedDefaultProps;

    setProps($widget, props);
  };

  return {
    pageReady(scoped$w: $W) {
      return customPageReady(scoped$w);
    },
    updateConfig: shouldInvokePropsChangedOnUpdateConfig(controllerConfig)
      ? updateConfig
      : undefined,
    updateWidgetViewState,
    getWidgetViewStateAfterRefresh,
    exports: (_, createEvent?: CreateEventFN) => widgetApiFactory(createEvent),
  };
}
