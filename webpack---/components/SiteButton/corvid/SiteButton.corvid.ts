import type { StyleState } from '@wix/editor-elements-corvid-utils';
import {
  composeSDKFactories,
  focusPropsSDKFactory,
  withValidation,
  linkPropsSDKFactory,
  labelPropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
  disablePropsSDKFactory,
  createStylePropsSDKFactory,
  createAccessibilityPropSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type {
  ISiteButtonOwnSdk,
  ISiteButtonProps,
  ISiteButtonSDK,
} from '../SiteButton.types';

const _siteButtonSDKFactory: ISiteButtonOwnSdk = api => {
  const { props, metaData } = api;
  return {
    get type() {
      return '$w.Button';
    },
    toJSON() {
      return {
        ...toJSONBase(metaData),
        type: '$w.Button',
        label: props.label || '',
      };
    },
  };
};

const siteButtonSDKFactory = withValidation(_siteButtonSDKFactory, {
  type: ['object'],
  properties: {
    onClick: {
      type: ['function'],
      args: [{ type: ['function'] }],
    },
  },
});

const supportedStyleStates: Array<StyleState> = ['hover', 'disabled'];
export const stylePropsSDKFactory = createStylePropsSDKFactory({
  BackgroundColor: {
    supportOpacity: true,
    supportedStates: supportedStyleStates,
  },
  BorderColor: {
    supportOpacity: true,
    supportedStates: supportedStyleStates,
  },
  BorderWidth: true,
  BorderRadius: true,
  TextColor: {
    supportedStates: supportedStyleStates,
  },
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaControls: true,
  enableAriaExpanded: true,
  enableAriaPressed: true,
  enableAriaOwns: true,
  enableAriaLive: true,
  enableAriaAtomic: true,
  enableAriaRelevant: true,
  enableAriaHaspopup: true,
  enableTabIndex: true,
  enableScreenReader: true,
});

export const sdk = composeSDKFactories<ISiteButtonProps, ISiteButtonSDK>([
  elementPropsSDKFactory,
  labelPropsSDKFactory,
  disablePropsSDKFactory,
  linkPropsSDKFactory,
  stylePropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  focusPropsSDKFactory,
  accessibilityPropsSDKFactory,
  siteButtonSDKFactory,
]);

export default createComponentSDKModel(sdk);
