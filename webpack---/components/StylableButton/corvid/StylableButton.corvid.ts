import type { StyleState } from '@wix/editor-elements-corvid-utils';
import {
  assert,
  composeSDKFactories,
  createSvgWixMediaUrl,
  messages,
  reportError,
  resolveAndFetchSvg,
  withValidation,
  clickPropsSDKFactory,
  focusPropsSDKFactory,
  createStylePropsSDKFactory,
  disablePropsSDKFactory,
  createElementPropsSDKFactory,
  labelPropsSDKFactory,
  createAccessibilityPropSDKFactory,
  toJSONBase,
  linkPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type { IPlatformHandlers } from '@wix/editor-elements-types/corvid';

import type {
  IStylableButtonOwnSDKFactory,
  IStylableButtonProps,
  IStylableButtonSDK,
  StyleProps,
} from '../StylableButton.types';

export const supportedStyleStates: Array<StyleState> = ['hover', 'disabled'];
export const stylePropsSDKFactory = createStylePropsSDKFactory({
  BackgroundColor: {
    withoutDefaultValue: true,
    supportOpacity: true,
    supportedStates: supportedStyleStates,
  },
  BorderColor: {
    withoutDefaultValue: true,
    supportOpacity: false,
    supportedStates: supportedStyleStates,
  },
  BorderRadius: { withoutDefaultValue: true },
  BorderWidth: { withoutDefaultValue: true },
  TextColor: {
    withoutDefaultValue: true,
    supportedStates: supportedStyleStates,
  },
  IconColor: {
    withoutDefaultValue: true,
    supportedStates: supportedStyleStates,
  },
});

const fetchIconSvgString = async (
  value: string,
  mediaSvgUrl: string,
  corvidProps: any,
  sanitizeSVG: IPlatformHandlers['sanitizeSVG'],
) => {
  const svg = await resolveAndFetchSvg(value, mediaSvgUrl, sanitizeSVG);
  return { corvid: { ...corvidProps, iconSvgString: svg } };
};

const _stylableButtonSDKFactory: IStylableButtonOwnSDKFactory = api => {
  const labelSDK = labelPropsSDKFactory(api);
  const styleSDK = stylePropsSDKFactory(api);
  const { props, setProps, sdkData, createSdkState, handlers } = api;
  const [state, setState] = createSdkState<{
    iconMediaUrl?: string | null;
  }>({});

  const mapPropertyNameToCorvidPropertyName: Partial<
    Record<keyof StyleProps, string>
  > = {
    backgroundColor: 'hasBackgroundColor',
    borderWidth: 'hasBorderWidth',
    borderRadius: 'hasBorderRadius',
    borderColor: 'hasBorderColor',
    iconColor: 'hasIconColor',
    color: 'hasColor',
  };

  const contributeStyleSDK =
    (propertyName: keyof StyleProps, styleState?: StyleState) =>
    (target: any) => {
      if (styleState && !target[styleState]) {
        target[styleState] = {};
      }

      const sdk: any = styleState ? styleSDK.style[styleState] : styleSDK.style;
      const targetSdk = styleState ? target[styleState] : target;

      Object.defineProperty(targetSdk, propertyName, {
        enumerable: true,
        get() {
          return sdk[propertyName];
        },
        set(value: string | undefined) {
          sdk[propertyName] = value;

          const statePropertyName =
            mapPropertyNameToCorvidPropertyName[propertyName]!;

          api.setProps({
            corvid: {
              ...api.props.corvid,
              ...(styleState
                ? {
                    [styleState]: {
                      ...api.props.corvid?.[styleState],
                      [statePropertyName]: true,
                    },
                  }
                : {
                    [statePropertyName]: true,
                  }),
            },
          });
        },
      });

      return target;
    };

  return {
    get label() {
      return labelSDK.label;
    },
    set label(value) {
      labelSDK.label = value;
    },
    get style() {
      return [
        contributeStyleSDK('backgroundColor'),
        contributeStyleSDK('borderColor'),
        contributeStyleSDK('borderRadius'),
        contributeStyleSDK('borderWidth'),
        contributeStyleSDK('iconColor'),
        contributeStyleSDK('color'),
        ...supportedStyleStates.flatMap(styleState => [
          contributeStyleSDK('backgroundColor', styleState),
          contributeStyleSDK('borderColor', styleState),
          contributeStyleSDK('iconColor', styleState),
          contributeStyleSDK('color', styleState),
        ]),
      ].reduce<object>((sdk, contribute) => contribute(sdk), {
        removeProperty(propertyName: string) {
          const [stylePropertyName, styleState] = propertyName
            .split('.')
            .reverse();

          const statePropertyName =
            mapPropertyNameToCorvidPropertyName[
              stylePropertyName as keyof StyleProps
            ];

          if (!statePropertyName) {
            return;
          }

          const propsToCorvid = {
            ...api.props.corvid,
            ...(styleState
              ? {
                  [styleState]: {
                    ...api.props.corvid?.[styleState as StyleState],
                    [statePropertyName]: false,
                  },
                }
              : {
                  [statePropertyName]: false,
                }),
          };

          styleSDK.style.removeProperty(propertyName as keyof StyleProps);
          api.setProps({ corvid: propsToCorvid });
        },
      });
    },
    get icon() {
      return state.iconMediaUrl || createSvgWixMediaUrl(sdkData.svgId, '');
    },
    set icon(value: string | null | undefined) {
      setState({ iconMediaUrl: value });
      if (value) {
        setProps(
          fetchIconSvgString(
            value,
            sdkData.mediaSvgUrl,
            props.corvid,
            handlers.sanitizeSVG,
          ),
        );
      } else {
        setProps({ corvid: { ...props.corvid, iconSvgString: null } });
      }
    },
    get iconCollapsed() {
      return !!props.corvid?.iconCollapsed;
    },
    set iconCollapsed(value: boolean) {
      setProps({ corvid: { ...props.corvid, iconCollapsed: value } });
    },
    collapseIcon() {
      setProps({ corvid: { ...props.corvid, iconCollapsed: true } });
    },
    expandIcon() {
      setProps({ corvid: { ...props.corvid, iconCollapsed: false } });
    },
    get type() {
      return '$w.Button';
    },
    toJSON() {
      const { label } = labelSDK;
      const { style } = styleSDK;

      return {
        ...toJSONBase(api.metaData),
        label,
        style: { ...style },
        type: '$w.Button',
      };
    },
  };
};

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const stylableButtonSDKFactory = withValidation(
  _stylableButtonSDKFactory,
  {
    type: ['object'],
    properties: { icon: { type: ['string', 'nil'] } },
  },
  {
    icon: [
      (value: string | null | undefined) => {
        if (value) {
          const isValid = assert.isSVG(value);
          if (!isValid) {
            reportError(messages.invalidSvgValue(value));
          }
        }
        return true;
      },
    ],
  },
);

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

export const sdk = composeSDKFactories<
  IStylableButtonProps,
  IStylableButtonSDK
>([
  elementPropsSDKFactory,
  clickPropsSDKFactory,
  focusPropsSDKFactory,
  disablePropsSDKFactory,
  linkPropsSDKFactory,
  accessibilityPropsSDKFactory,
  stylableButtonSDKFactory,
]);

export default createComponentSDKModel(sdk);
