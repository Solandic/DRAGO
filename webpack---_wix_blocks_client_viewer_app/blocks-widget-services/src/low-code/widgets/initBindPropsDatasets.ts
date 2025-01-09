import {
  $Widget,
  ControllerConfig,
  WidgetConfig,
} from '@wix/blocks-widget-services-types';

type Element = any;
type Connection = {
  compId: string;
  role: string;
  config?: Record<string, unknown>;
};

export type DataChangedHandler<T> = (oldData: T, newData: T) => void;

export interface InitBlocksDatasetParams<TProps> {
  getData(): TProps;
  onDataChanged(cb: DataChangedHandler<TProps>): void;
}

interface PropsDataset<TProps> extends Element {
  initWidgetDataSource(params: InitBlocksDatasetParams<TProps>): void;
}

function isPropsDataset<TProps>(
  element: Element,
): element is PropsDataset<TProps> {
  return (
    'initWidgetDataSource' in element &&
    typeof element.initWidgetDataSource === 'function'
  );
}

function getPropsDatasets<TProps extends object, TAppData extends object = {}>(
  controllerConfig: ControllerConfig<WidgetConfig<TProps>, TAppData>,
): PropsDataset<TProps>[] {
  if (
    !('connections' in controllerConfig) ||
    !Array.isArray(controllerConfig.connections)
  ) {
    return [];
  }
  return controllerConfig.connections
    .map((connection: Connection) => controllerConfig.$w('#' + connection.role))
    .filter((element: Element) => isPropsDataset(element));
}

export function initBindPropsDatasets<
  TProps extends object,
  TAppData extends object = {},
>(
  controllerConfig: ControllerConfig<WidgetConfig<TProps>, TAppData>,
  $widget: $Widget<TProps>,
) {
  const datasets = getPropsDatasets(controllerConfig);

  datasets.forEach((dataset) => {
    dataset.initWidgetDataSource({
      getData: () => $widget.props,
      onDataChanged: (cb) =>
        $widget.onPropsChanged((oldProps, newProps) => cb(oldProps, newProps)),
    });
  });
}
