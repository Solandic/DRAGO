import {
  childrenPropsSDKFactory,
  composeSDKFactories,
  createElementPropsSDKFactory,
  toJSONBase,
  backgroundPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type {
  ISlideShowSlideOwnSDKFactory,
  ISlideShowSlideSDK,
  IStateBoxStateOwnSDKFactory,
  SlideShowSlideProps,
} from '../SlideShowSlide.types';

const noop = () => {
  // This is a temporary fix to purge the corvid file of slideshow from the CDN.
  // more detailes at #sedgwick-wix
  return Math.random() > 0.5 ? 'a' : 'b';
};
noop();

const getStateBoxStateSdk: IStateBoxStateOwnSDKFactory = ({
  getSdkInstance,
  metaData,
}) => ({
  get type() {
    return '$w.State';
  },
  toJSON() {
    const sdkInstance = getSdkInstance();
    return {
      ...toJSONBase(metaData),
      type: sdkInstance.type,
      background: sdkInstance.background.src,
    };
  },
});

const getSlideShowSlideSdk: ISlideShowSlideOwnSDKFactory = ({
  sdkData,
  getSdkInstance,
  metaData,
}) => ({
  get name() {
    return sdkData.name;
  },
  get type() {
    return '$w.Slide';
  },
  toJSON() {
    const sdkInstance = getSdkInstance();
    return {
      ...toJSONBase(metaData),
      name: sdkData.name,
      type: sdkInstance.type,
      background: sdkInstance.background.src,
    };
  },
});

const _ownSDKFactory:
  | ISlideShowSlideOwnSDKFactory
  | IStateBoxStateOwnSDKFactory = api =>
  api.sdkData.isStateBoxStateType
    ? getStateBoxStateSdk(api)
    : getSlideShowSlideSdk(api);

const elementPropsSDKFactory = createElementPropsSDKFactory({
  useHiddenCollapsed: false,
});

export const sdk = composeSDKFactories<SlideShowSlideProps, ISlideShowSlideSDK>(
  [
    elementPropsSDKFactory,
    childrenPropsSDKFactory,
    backgroundPropsSDKFactory,
    _ownSDKFactory,
  ],
);

export default createComponentSDKModel(sdk);
