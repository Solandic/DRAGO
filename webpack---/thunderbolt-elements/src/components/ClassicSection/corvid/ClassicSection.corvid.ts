import {
  composeSDKFactories,
  backgroundPropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  createElementPropsSDKFactory,
  createStylePropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import { corvidName as type } from '../constants';
import type {
  IClassicSectionOwnSDKFactory,
  IClassicSectionSDK,
  IClassicSectionSDKFactory,
  ClassicSectionProps,
} from '../ClassicSection.types';

const classicSectionSDKFactory: IClassicSectionOwnSDKFactory = sdkProps => {
  const { metaData } = sdkProps;

  return {
    ...backgroundPropsSDKFactory(sdkProps),
    get type() {
      return type;
    },
    toJSON() {
      return {
        ...toJSONBase(metaData),
        type,
      };
    },
  };
};

const elementPropsSDKFactory = createElementPropsSDKFactory();

const stylePropsSDKFactory = createStylePropsSDKFactory(
  { BackgroundColor: true },
  { cssVarPrefix: 'section' },
);

export const sdk: IClassicSectionSDKFactory = composeSDKFactories<
  ClassicSectionProps,
  IClassicSectionSDK
>([
  elementPropsSDKFactory,
  classicSectionSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  stylePropsSDKFactory,
]);

export default createComponentSDKModel(sdk);
