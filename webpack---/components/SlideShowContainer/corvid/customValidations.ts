import type { CorvidSDKApi } from '@wix/editor-elements-types/corvid';
import {
  assert,
  messages,
  reportError,
} from '@wix/editor-elements-corvid-utils';
import type { ISlideShowSlideSDK } from '../../SlideShowSlide/SlideShowSlide.types';
import type { SlideShowContainerProps } from '../SlideShowContainer.types';

export const isValidSlideReference = (
  functionArgs: [number | ISlideShowSlideSDK],
  sdkFactoryArgs: CorvidSDKApi<SlideShowContainerProps>,
) => {
  const [slideReference] = functionArgs;
  const isObjectSlideReference = assert.isObject(slideReference);

  const slides = sdkFactoryArgs.getChildren();
  const maxNextSlideIndex = slides.length - 1;

  let nextSlideIndex = -1;
  if (assert.isNumber(slideReference)) {
    nextSlideIndex = slideReference;
  } else if (isObjectSlideReference) {
    const isSlideSDKObject = Object.keys(slides[0]).every(key =>
      slideReference.hasOwnProperty(key),
    );
    if (!isSlideSDKObject) {
      reportError(
        messages.invalidTypeMessage({
          propertyName: 'slideInfo',
          functionName: 'changeSlide',
          value: slideReference,
          types: ['slide', 'integer'],
          index: undefined,
        }),
      );
      return false;
    }

    nextSlideIndex = slides.findIndex(slide => slide.id === slideReference.id);
  }

  if (nextSlideIndex < 0 || nextSlideIndex > maxNextSlideIndex) {
    reportError(
      messages.invalidSlideInputMessage({
        value: isObjectSlideReference
          ? (slideReference as ISlideShowSlideSDK).id
          : nextSlideIndex,
        propertyName: 'slideInfo',
        functionName: 'changeSlide',
        minimum: 0,
        maximum: maxNextSlideIndex,
        slideShowId: sdkFactoryArgs.metaData.role,
      }),
    );
    return false;
  }

  return true;
};
