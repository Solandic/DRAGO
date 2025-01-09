import type { ActivityCounter } from '@wix/ambassador-members-v1-activity-counter/types';
import { countViewerFeedNotifications } from '@wix/ambassador-notifications-members-feed-v1-members-viewer-feed-notification/http';
import {
  Channel,
  Status,
} from '@wix/ambassador-notifications-members-feed-v1-members-viewer-feed-notification/types';
import { getNumberOfUnseenNotifications } from '@wix/ambassador-ping-feed-v1-notification/http';
import {
  FeedChannel,
  SpecialMigrationSpecs,
} from '@wix/ambassador-ping-feed-v1-notification/types';
import { MEMBERS_AREA } from '@wix/app-definition-ids';
import type { ViewerScriptFlowAPI } from '@wix/yoshi-flow-editor';

import { Experiment, NOTIFICATIONS_APP_ID } from '../constants';
import type { FlowAPI, WixCodeApi } from '../types';

interface Request {
  flowAPI: FlowAPI | ViewerScriptFlowAPI;
  memberId: string;
  metaSiteId: string;
  wixCodeApi: WixCodeApi;
}

export async function getNumberOfUnseenNotificationsActivityCounter({
  metaSiteId,
  flowAPI,
  memberId,
  wixCodeApi,
}: Request): Promise<ActivityCounter | null> {
  const signedInstance = wixCodeApi.site.getAppToken?.(MEMBERS_AREA);

  if (!signedInstance) {
    return null;
  }
  const useV2 = flowAPI.experiments.enabled(Experiment.UseNotificationsV2Api);
  try {
    let numberOfUnseen: number | undefined;
    if (useV2) {
      const {
        data: { count },
      } = await flowAPI.httpClient.request(
        countViewerFeedNotifications({
          filter: {
            channel: Channel.WEB,
            status: Status.UNSEEN,
          },
          maxCount: 100,
        }),
        { signedInstance },
      );
      numberOfUnseen = count;
    } else {
      const response = await flowAPI.httpClient.request(
        getNumberOfUnseenNotifications({
          shouldCancelMergeContactInMobile: false,
          recipient: {
            contact: {
              metaSiteId,
              contactId: memberId,
            },
          },
          feedFilter: {
            channel: FeedChannel.WEB,
          },
          specialMigrationSpecs: [SpecialMigrationSpecs.HideChatNotifications],
        }),
        { signedInstance },
      );

      numberOfUnseen = response?.data?.numberOfUnseen;
    }

    if (!numberOfUnseen) {
      return null;
    }

    return {
      memberId,
      appId: NOTIFICATIONS_APP_ID,
      counters: [
        { key: 'notificationsCount', public: false, count: numberOfUnseen },
      ],
    };
  } catch (error) {
    flowAPI.errorMonitor?.captureException(error as Error);
    return null;
  }
}
