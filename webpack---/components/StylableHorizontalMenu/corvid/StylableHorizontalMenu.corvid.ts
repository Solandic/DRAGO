import {
  composeSDKFactories,
  focusPropsSDKFactory,
  menuItemsPropsSDKFactory,
  createElementPropsSDKFactory,
  createAccessibilityPropSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories([
  elementPropsSDKFactory,
  focusPropsSDKFactory,
  menuItemsPropsSDKFactory,
  createAccessibilityPropSDKFactory({
    enableAriaLabel: true,
    enableAriaLive: true,
    enableAriaLabelledBy: false,
    enableAriaDescribedBy: false,
    enableRole: true,
    enableScreenReader: true,
  }),
]);

export default createComponentSDKModel(sdk);
