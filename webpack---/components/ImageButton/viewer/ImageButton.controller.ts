import type { IPlatformData } from '@wix/editor-elements-integrations';
import { withCompController } from '@wix/editor-elements-integrations';
import {
  AnalyticsClicksGroups,
  tryReportAnalyticsClicksBi,
} from '@wix/editor-elements-common-utils';
import type {
  ImageButtonControllerProps,
  ImageButtonMapperProps,
  ImageButtonProps,
  ImageButtonStateValues,
} from '../ImageButton.types';

const useComponentProps = ({
  mapperProps,
  stateValues,
}: IPlatformData<
  ImageButtonMapperProps,
  ImageButtonControllerProps,
  ImageButtonStateValues
>): ImageButtonProps => {
  const {
    compId,
    language,
    mainPageId,
    fullNameCompType,
    trackClicksAnalytics,
    ...restMapperProps
  } = mapperProps;

  const reportBiOnClick: ImageButtonControllerProps['reportBiOnClick'] =
    event => {
      const { reportBi } = stateValues;
      const { alt, link, defaultImage, isDisabled } = restMapperProps;

      tryReportAnalyticsClicksBi(reportBi, {
        link,
        language,
        trackClicksAnalytics,
        elementTitle: alt,
        elementType: fullNameCompType,
        pagesMetadata: { mainPageId },
        elementGroup: AnalyticsClicksGroups.Button,
        element_id: compId ?? event.currentTarget.id,
        details: { uri: defaultImage.uri, isDisabled: isDisabled ?? false },
      });
    };

  return {
    ...restMapperProps,
    reportBiOnClick,
  };
};

export default withCompController(useComponentProps);
