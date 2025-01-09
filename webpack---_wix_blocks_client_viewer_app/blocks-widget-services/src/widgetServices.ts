import {
  $W,
  $Widget,
  PropsChangedHandler,
} from '@wix/blocks-widget-services-types';
import { pushObservedObject } from './utils/objectObserver';

interface EventsRegistrar<T extends object> {
  register: (callback: PropsChangedHandler<T>) => void;
  fire: PropsChangedHandler<T>;
}

export interface WidgetEventPayload {
  type: string;
  data: any;
}

const toWidgetEventPayload = (data: any): WidgetEventPayload => ({
  type: 'widgetEvent',
  data,
});

function createEventRegistrar<T extends object>(): EventsRegistrar<T> {
  const callbacksArray: PropsChangedHandler<T>[] = [];

  return {
    register(callback: PropsChangedHandler<T>) {
      callbacksArray.push(callback);
    },
    fire(
      oldProps: T,
      newProps: T,
      internalApi?: {
        _internalApiDoNotUse: { propName: string; path: string[] };
      },
    ) {
      callbacksArray.forEach((cb) => cb(oldProps, newProps, internalApi));
    },
  };
}

export function createWidgetServices<T extends object>(
  widgetProps: T,
  shouldAddInternalApi: boolean = true,
) {
  const onPropsChangedRegistrar: EventsRegistrar<T> = createEventRegistrar();
  const widgetProperties: T = widgetProps;

  function generate$widget($w: $W): $Widget<T, Record<string, any>> {
    return {
      props: widgetProperties,
      onPropsChanged(cb) {
        onPropsChangedRegistrar.register(cb);
      },
      fireEvent(eventName, data) {
        $w.fireEvent(eventName, toWidgetEventPayload(data));
      },
    };
  }

  function generateWidgetAPI<P extends object>(
    $widget: $Widget<T>,
    initialWidgetAPI: P,
  ) {
    const widgetAPI = { ...initialWidgetAPI };

    pushObservedObject(
      widgetAPI,
      $widget.props,
      Object.keys($widget.props),
      (
        oldProps: T,
        newProps: T,
        internalApi?: {
          _internalApiDoNotUse: { propName: string; path: string[] };
        },
      ) => {
        onPropsChangedRegistrar.fire(oldProps, newProps, internalApi);
      },
      shouldAddInternalApi,
    );

    return widgetAPI;
  }

  function setProps($widget: $Widget<T, Record<string, any>>, newProps: T) {
    const oldProps = $widget.props;
    $widget.props = newProps;
    onPropsChangedRegistrar.fire(oldProps, newProps);
  }

  return {
    generate$widget,
    generateWidgetAPI,
    setProps,
  };
}
