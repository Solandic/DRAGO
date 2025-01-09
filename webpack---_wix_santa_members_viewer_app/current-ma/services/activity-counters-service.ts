import { getActivityCounters } from '@wix/ambassador-members-v1-activity-counter/http';
import type { ActivityCounter } from '@wix/ambassador-members-v1-activity-counter/types';
import type {
  IPlatformServices,
  ViewerScriptFlowAPI,
} from '@wix/yoshi-flow-editor';

import { Experiment, NOTIFICATIONS_APP_ID } from '../../constants';
import { getNumberOfUnseenNotificationsActivityCounter } from '../../services/ping-feed-service';
import type { WixCodeApi } from '../../types';

interface Request {
  memberId: string;
  loggedIn: boolean;
  biService: IPlatformServices['bi'];
  flowAPI: ViewerScriptFlowAPI;
  wixCodeApi: WixCodeApi;
}

// Workaround for https://wix.atlassian.net/browse/MA-3846. We receive
// total notificationsCount from getActivityCounters and in our menus we
// want to show only unseen notificationsCount, which has the same
// counter key.
function maybeFilterActivityCounters(
  activityCounters: ActivityCounter[],
  shouldFilterActivityCounters: boolean,
) {
  if (!shouldFilterActivityCounters) {
    return activityCounters;
  }

  const filteredCounters: ActivityCounter[] = [];

  activityCounters.forEach((activityCounter) => {
    if (activityCounter.appId !== NOTIFICATIONS_APP_ID) {
      return filteredCounters.push(activityCounter);
    }

    const counters = activityCounter.counters?.filter(
      ({ key }) => key !== 'notificationsCount',
    );

    if (counters?.length) {
      filteredCounters.push({
        ...activityCounter,
        counters,
      });
    }
  });

  return filteredCounters;
}

export async function getMemberActivityCounters({
  memberId,
  loggedIn,
  biService,
  flowAPI,
  wixCodeApi,
}: Request) {
  try {
    const [activityCountersResponse, numberOfUnseenActivityCounter] =
      await Promise.all([
        flowAPI.httpClient.request(getActivityCounters({ memberId })),
        loggedIn
          ? getNumberOfUnseenNotificationsActivityCounter({
              metaSiteId: biService?.bi?.metaSiteId,
              memberId,
              flowAPI,
              wixCodeApi,
            })
          : null,
      ]);

    const shouldFilterActivityCounters = flowAPI.experiments.enabled(
      Experiment.FilterConflictingActivityCounters,
    );

    const activityCounters = maybeFilterActivityCounters(
      activityCountersResponse?.data?.activityCounters || [],
      shouldFilterActivityCounters,
    );

    if (numberOfUnseenActivityCounter) {
      activityCounters.push(numberOfUnseenActivityCounter);
    }

    const apps = activityCounters.map((activityCounter) => ({
      appDefId: activityCounter.appId,
      numbers: activityCounter.counters?.reduce(
        (
          acc: Record<string, { public?: boolean; count?: number }>,
          counter,
        ) => {
          acc[counter.key!] = {
            public: counter.public,
            count: counter.count,
          };
          return acc;
        },
        {},
      ),
    }));

    return apps;
  } catch (error) {
    flowAPI.errorMonitor?.captureException(error as Error);
    return [];
  }
}

export type MemberActivityCounters = Awaited<
  ReturnType<typeof getMemberActivityCounters>
>;
