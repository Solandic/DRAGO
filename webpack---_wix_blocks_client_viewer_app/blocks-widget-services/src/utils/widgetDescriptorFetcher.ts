import {
  BlocksConfig,
  WidgetControllerConfig,
  WidgetMetaData,
} from '@wix/blocks-widget-services-types';
import { ILogger } from '../common/ILogger';
import { FetchDescriptorError } from '../errors/fetchDescriptorError';
import { generateWidgetDescriptorUrl } from './urlBuilder';
import { fetchWithRetries } from './fetchWithRetries';
import { isFetchError } from '../errors/fetchError';
import { isAbortFetchError } from '../errors/abortFetchError';
import { isCustomTypeError } from '../errors/customTypeError';

const EMPTY_META_DATA: WidgetMetaData = {};

const FETCH_WIDGET_DESCRIPTOR_INTERACTION = 'fetch-widget-descriptor';
const DESCRIPTOR_WARMUP_KEY_PREFIX = '$blocks-warmup-descriptor';

async function fetchDescriptor(descriptorUrl: string) {
  try {
    return await fetchWithRetries<WidgetMetaData>(descriptorUrl);
  } catch (e) {
    // This means that the descriptor does not exists for the widget
    if (isFetchError(e) && e.statusCode === 403) {
      console.info('missing widget descriptor', { descriptorUrl });

      return EMPTY_META_DATA;
    }

    throw e;
  }
}

export async function fetchRemoteMetaData(
  widgetConfig: WidgetControllerConfig,
  blocksConfig: BlocksConfig,
  logger?: ILogger,
): Promise<WidgetMetaData> {
  if (!widgetConfig.config.devCenterWidgetId) {
    console.info('missing devCenterWidgetId', {
      type: widgetConfig.config.type,
    });

    return EMPTY_META_DATA;
  }

  const warmupDescriptorKey = `${DESCRIPTOR_WARMUP_KEY_PREFIX}_${widgetConfig.config.devCenterWidgetId}`;

  const warmedUpDescriptor =
    widgetConfig.wixCodeApi.window.warmupData.get(warmupDescriptorKey);

  if (warmedUpDescriptor) {
    return warmedUpDescriptor;
  }

  const descriptorUrl = generateWidgetDescriptorUrl(
    widgetConfig.config.devCenterWidgetId,
    blocksConfig,
  );

  try {
    logger?.interactionStarted(FETCH_WIDGET_DESCRIPTOR_INTERACTION);

    const descriptor = await fetchDescriptor(descriptorUrl);

    widgetConfig.wixCodeApi.window.warmupData.set(
      warmupDescriptorKey,
      descriptor,
    );

    logger?.interactionEnded(FETCH_WIDGET_DESCRIPTOR_INTERACTION);

    return descriptor;
  } catch (e) {
    /* istanbul ignore if */
    if (isAbortFetchError(e)) {
      logger?.interactionEnded(FETCH_WIDGET_DESCRIPTOR_INTERACTION);

      throw e;
    }

    /* istanbul ignore if */
    if (isCustomTypeError(e)) {
      throw e;
    }

    throw new FetchDescriptorError(descriptorUrl, e);
  }
}
