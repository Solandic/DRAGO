import {
  withValidation,
  composeSDKFactories,
  assert,
  keyUpPropsSDKFactory,
  createElementPropsSDKFactory,
  createAccessibilityPropSDKFactory,
  clickPropsSDKFactory,
  toJSONBase,
  focusPropsSDKFactory,
  createStylePropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import { sanitizeHTML } from '@wix/editor-elements-common-utils';
import type {
  IWRichTextProps,
  IWRichTextSDK,
  IWRichTextOwnSDKFactory,
  WRichTextSdkData,
  IWRichTextCorvidProps,
  IStylePropsSDK,
} from '../WRichText.types';
import {
  wixGuard,
  endBlockTagRegex,
  endTagRegex,
  startTagRegex,
  wixCodeName as type,
} from '../constants';

import type { SetHTMLTransformConfig } from './utils';
import {
  flow,
  applyTransformationForGetHtml,
  applyTransformationForSetHtml,
  convertLinkProperties,
  removeWixGuard,
  decode,
  insertContentInHtml,
  insertContentInMarker,
  getMarkerContent,
  wrapWithRichTextMarker,
  hasRichTextMarker,
  escape,
  unescape,
  stripImpliedLinks,
  replaceFirstTagWith,
} from './utils';
import { injectTextSemanticClassName } from '../utils';

const endBlockTagPattern = new RegExp(endBlockTagRegex, 'mg');
const endTagPattern = new RegExp(endTagRegex, 'mg');
const startTagPattern = new RegExp(startTagRegex, 'mg');

const isUndefined = (str: string) => (assert.isNil(str) ? '' : str);

const stylePropsSDKFactory = createStylePropsSDKFactory({
  TextColor: true,
});

export const mapStylePropertyNameToCorvidPropertyName: Record<
  keyof IStylePropsSDK['style'],
  keyof IWRichTextCorvidProps['corvid']
> = {
  color: 'hasColor',
};

export const _wRichTextSdkFactory: IWRichTextOwnSDKFactory = api => {
  const styleSDK = stylePropsSDKFactory(api);

  const {
    setProps,
    props,
    platformUtils: { linkUtils },
    metaData,
    sdkData,
    createSdkState,
  } = api;

  const [sdkState, setSDKState] = createSdkState<WRichTextSdkData>(sdkData);

  const getLinkProps = (url: string) => {
    if (!sdkState.linkPropsByHref || !sdkState.linkPropsByHref[url]) {
      const linkProperties = linkUtils.getLinkProps(url); // Properties
      setSDKState({
        linkPropsByHref: {
          ...(sdkState.linkPropsByHref || {}),
          [url]: linkProperties,
        },
      });
    }
    return sdkState.linkPropsByHref[url];
  };

  const convertLinksForSetter = (str: string) =>
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore TODO: Fix type for getLink after types merge in TB
    convertLinkProperties(str, getLinkProps);

  const convertLinksForGetter = (str: string) =>
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore TODO: Fix type for getLink after types merge in TB
    convertLinkProperties(str, getLinkProps, linkUtils.getLink);

  const getHtml = () =>
    flow(
      removeWixGuard,
      stripImpliedLinks,
      applyTransformationForGetHtml,
      convertLinksForGetter,
    )(props.html);

  const getPreparedHTML = (
    html: string,
    config?: SetHTMLTransformConfig,
    shouldInjectSemanticClassNames?: boolean,
  ) => {
    const flowParts = [
      isUndefined,
      (_html: any) => applyTransformationForSetHtml(_html, config),
      convertLinksForSetter,
      linkUtils.getImpliedLinks,
      sanitizeHTML,
    ];
    if (shouldInjectSemanticClassNames) {
      flowParts.push(injectTextSemanticClassName);
    }
    return flow(...flowParts)(html);
  };

  const getText = () =>
    props.html
      ? decode(
          unescape(
            stripImpliedLinks(removeWixGuard(props.html))
              .replace(/\n/g, '')
              .replace(/<br>/g, '\n')
              .replace(/<br><\/br>/g, '\n')
              .replace(/<br\s*\/?>/g, '\n')
              .replace(endBlockTagPattern, '\n')
              .replace(endTagPattern, '')
              .replace(startTagPattern, '')
              .trim(),
          ),
        )
      : '';

  const getRichText = () => flow(isUndefined, getMarkerContent)(props.html);

  return {
    get type() {
      return type;
    },

    get html() {
      return getHtml();
    },

    set html(value) {
      setProps({
        html: getPreparedHTML(
          value,
          { addDefaultClasses: true },
          sdkData.shouldAttachSemanticClassNames,
        ),
      });
    },

    get text() {
      return getText();
    },

    set text(value) {
      const escapedHTML = value
        ? escape(value).replace(/\n/g, '<br>')
        : wixGuard;

      const html = linkUtils.getImpliedLinks(
        insertContentInHtml(stripImpliedLinks(props.html), escapedHTML),
        { parseEscaped: true },
      );

      setProps({
        html,
      });
    },

    get richText() {
      return getRichText();
    },
    set richText(value) {
      // If the first tag is p it should be replaced with a div
      // Bugfix for: https://jira.wixpress.com/browse/EE-36818
      const currentHtml = replaceFirstTagWith(props.html, 'p', 'div');

      if (hasRichTextMarker(currentHtml)) {
        setProps({
          html: insertContentInMarker(currentHtml, getPreparedHTML(value)),
        });
      } else {
        const html = getPreparedHTML(value);
        const withMarker = wrapWithRichTextMarker(html);
        setProps({
          html: insertContentInHtml(currentHtml, withMarker),
        });
      }
    },

    get style() {
      return {
        get color() {
          return styleSDK.style.color;
        },
        set color(color: string | undefined) {
          styleSDK.style.color = color;
          setProps({
            corvid: {
              ...props.corvid,
              hasColor: Boolean(styleSDK.style.color),
            },
          });
        },
        removeProperty(propertyName: keyof IStylePropsSDK['style']) {
          const corvidPropertyName =
            mapStylePropertyNameToCorvidPropertyName[propertyName];

          if (!corvidPropertyName) {
            return;
          }

          styleSDK.style.removeProperty(propertyName);
          api.setProps({
            corvid: { ...api.props.corvid, [corvidPropertyName]: false },
          });
        },
      };
    },

    toJSON() {
      return {
        ...toJSONBase(metaData),
        type,
        html: getHtml(),
        text: getText(),
        richText: getRichText(),
      };
    },
  };
};

const wRichTextSDKFactory = withValidation(_wRichTextSdkFactory, {
  type: ['object'],
  properties: {
    html: { type: ['string', 'nil'], warnIfNil: true },
    text: { type: ['string', 'nil'], warnIfNil: true },
  },
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableRole: true,
  enableAriaHidden: true,
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaRoleDescription: true,
  enableAriaLive: true,
  enableAriaAtomic: true,
  enableAriaRelevant: true,
  enableAriaBusy: true,
  enableTabIndex: true,
  enableScreenReader: true,
});

export const sdk = composeSDKFactories<IWRichTextProps, any, IWRichTextSDK>([
  elementPropsSDKFactory,
  clickPropsSDKFactory,
  accessibilityPropsSDKFactory,
  wRichTextSDKFactory,
  focusPropsSDKFactory,
  keyUpPropsSDKFactory,
]);

export default createComponentSDKModel(sdk);
