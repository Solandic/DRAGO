import type { PickStateRefValues } from '@wix/editor-elements-integrations';
import { withCompController } from '@wix/editor-elements-integrations';
import type { WRichTextProps } from '@wix/thunderbolt-components';
import { isExperimentOpen } from '@wix/editor-elements-common-utils';
import type { VerticalAlignTopExperiment } from '../WRichText.types';
import { wrichtextListInRtlExperiment } from '../constants';

// Should be removed after the specs.thunderbolt.WRichTextVerticalAlignTopSafariAndIOS,
// specs.thunderbolt.wrichtextListInRtl
// specs.thunderbolt.classNameToRoot
// are open to 100%

export default withCompController<
  WRichTextProps,
  {},
  WRichTextProps & VerticalAlignTopExperiment,
  PickStateRefValues<'experiments'>
>(({ mapperProps, stateValues }) => {
  const { experiments = {} } = stateValues;
  const shouldFixVerticalTopAlignment = isExperimentOpen(
    experiments,
    'specs.thunderbolt.WRichTextVerticalAlignTopSafariAndIOS',
  );

  const isListInRtlEnabled = isExperimentOpen(
    experiments,
    wrichtextListInRtlExperiment,
  );

  const isClassNameToRootEnabled = isExperimentOpen(
    experiments,
    'specs.thunderbolt.isClassNameToRootEnabled',
  );

  return {
    ...mapperProps,
    shouldFixVerticalTopAlignment,
    isListInRtlEnabled,
    isClassNameToRootEnabled,
  };
});
