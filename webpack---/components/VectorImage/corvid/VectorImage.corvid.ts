import * as vectorImage from '@wix/thunderbolt-commons/dist/vectorImage';
import type { VectorImageTransformationOptions } from '@wix/thunderbolt-commons/dist';
import type { VectorImageSdkData } from '@wix/thunderbolt-components';
import type { CorvidSDKFactory } from '@wix/editor-elements-types/corvid';
import {
  withValidation,
  messages,
  reportError,
  composeSDKFactories,
  assert,
  resolveSvg,
  createSvgWixMediaUrl,
  isFallbackSvg,
  SVG_TYPE_INLINE,
  SVG_TYPE_URL,
  resolveAndFetchSvg,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  linkPropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
  createAccessibilityPropSDKFactory,
  createStylePropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type { IVectorImageProps } from '../VectorImage.types';

const processSvg = (rawSvg: string, sdkData: ClientSdkData) => {
  const { info: svgInfo } = vectorImage.parseSvgString(rawSvg);
  return vectorImage.transformVectorImage(rawSvg, {
    ...sdkData,
    svgInfo,
  } as VectorImageTransformationOptions);
};

const getSvgStyles = (shouldScaleStroke: boolean) => {
  return shouldScaleStroke
    ? { '--stroke-width': 'unset', '--stroke': 'unset' }
    : {};
};

const transformSvg = (
  type: string,
  content: string,
  shouldScaleStroke: boolean,
  sdkData: ClientSdkData,
) => {
  if (type === SVG_TYPE_INLINE) {
    return { svgContent: content, shouldScaleStroke };
  }

  if (isFallbackSvg(content)) {
    return {
      svgContent: content,
      shouldScaleStroke,
    };
  }

  const { info: svgInfo } = vectorImage.parseSvgString(content);

  return {
    svgContent: processSvg(content, sdkData),
    shouldScaleStroke: shouldScaleStroke || svgInfo.svgType === 'ugc',
  };
};

type ClientSdkData = VectorImageSdkData & {
  userSrc?: string;
};

export type VectorImageSDK = {
  src: string;
};

const _vectorImageSDKFactory: CorvidSDKFactory<
  IVectorImageProps,
  VectorImageSDK,
  ClientSdkData
> = ({ setProps, setStyles, sdkData, metaData, createSdkState, handlers }) => {
  const [state, setState] = createSdkState<{ userSrc?: string }>({});
  return {
    get src() {
      return (
        state.userSrc || createSvgWixMediaUrl(sdkData.svgId, sdkData.altText)
      );
    },
    set src(url) {
      setState({ userSrc: url });
      const { type } = resolveSvg(url, sdkData.mediaSvgUrl);
      const shouldScaleStroke = [SVG_TYPE_INLINE, SVG_TYPE_URL].includes(type);
      setStyles(getSvgStyles(shouldScaleStroke));
      setProps(
        resolveAndFetchSvg(url, sdkData.mediaSvgUrl, handlers.sanitizeSVG).then(
          (svg: string) => {
            return transformSvg(type, svg, shouldScaleStroke, sdkData);
          },
        ),
      );
    },
    toJSON() {
      const { src } = this;
      return {
        ...toJSONBase(metaData),
        src,
      };
    },
  };
};

const vectorImageSDKFactory = withValidation(
  _vectorImageSDKFactory,
  {
    type: ['object'],
    properties: { src: { type: ['string'] } },
  },
  {
    src: [
      (value: VectorImageSDK['src']) => {
        const isValid = assert.isSVG(value);
        if (!isValid) {
          // FIXME - customRule will eventually need to inject 'index' argment (for repeaters scenario)
          reportError(messages.invalidSvgValue(value));
        }
        return true;
      },
    ],
  },
);

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableAriaLabel: true,
});

export const stylePropsSDKFactory = createStylePropsSDKFactory({
  FillColor: true,
  StrokeColor: true,
});

export const sdk = composeSDKFactories<IVectorImageProps, VectorImageSDK>([
  createElementPropsSDKFactory(),
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  linkPropsSDKFactory,
  vectorImageSDKFactory,
  accessibilityPropsSDKFactory,
  stylePropsSDKFactory,
]);

export default createComponentSDKModel(sdk);
