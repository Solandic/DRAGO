import {
  assert,
  composeSDKFactories,
  withValidation,
  changePropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  createElementPropsSDKFactory,
  playablePropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type {
  ISlideShowContainerOwnSDKFactory,
  SlideShowContainerProps,
  ISlideShowContainerSDK,
  SlideShowContainerSDKState,
} from '../SlideShowContainer.types';
import type { ISlideShowSlideSDK } from '../../SlideShowSlide/SlideShowSlide.types';
import { isValidSlideReference } from './customValidations';

const _slideShowContainerSDKFactory: ISlideShowContainerOwnSDKFactory = ({
  sdkData,
  setStyles,
  registerEvent,
  props,
  compRef,
  getChildren,
  metaData,
  createSdkState,
}) => {
  const [state, setState] = createSdkState<SlideShowContainerSDKState>({
    showSlideButtons: sdkData.showSlideButtons,
    showNavigationButtons: sdkData.showNavigationButtons,
    slideChangedHandlers: [],
  });

  registerEvent('onCurrentSlideChanged', (newSlideIndex: number) => {
    const slides = getChildren();
    state.slideChangedHandlers.forEach(cb => cb(slides[newSlideIndex]));
    setState({ slideChangedHandlers: [] });
  });

  const sdkProps = {
    changeSlide: async (slideReference: number | ISlideShowSlideSDK) => {
      const slides = getChildren();
      const currentSlideIndex = props.currentSlideIndex;
      const nextSlideIndex = assert.isNumber(slideReference)
        ? slideReference
        : slides.findIndex(slide => slide.id === slideReference.id);

      if (currentSlideIndex === nextSlideIndex) {
        return Promise.resolve(slides[currentSlideIndex]);
      }

      return new Promise<ISlideShowSlideSDK>(resolve => {
        setState({
          slideChangedHandlers: [
            ...state.slideChangedHandlers,
            () => resolve(slides[nextSlideIndex]),
          ],
        });
        compRef.moveToSlide({ slideIndex: nextSlideIndex });
      });
    },
    next() {
      return new Promise<ISlideShowSlideSDK>(resolve => {
        setState({
          slideChangedHandlers: [...state.slideChangedHandlers, resolve],
        });
        compRef.next();
      });
    },
    previous() {
      return new Promise<ISlideShowSlideSDK>(resolve => {
        setState({
          slideChangedHandlers: [...state.slideChangedHandlers, resolve],
        });
        compRef.previous();
      });
    },
    get isPlaying() {
      const isPlaying = props.isPlaying;
      if (assert.isBoolean(isPlaying)) {
        return isPlaying;
      }
      return props.autoPlay && getChildren().length > 1;
    },
    get slides() {
      return getChildren();
    },
    get currentSlide() {
      const slides = getChildren();
      return slides[props.currentSlideIndex];
    },
    get currentIndex() {
      return props.currentSlideIndex;
    },
    get showSlideButtons() {
      return state.showSlideButtons;
    },
    set showSlideButtons(show: boolean) {
      setStyles({
        '--nav-dot-section-display': show
          ? 'block !important'
          : 'none !important',
      });
      setState({ showSlideButtons: show });
    },
    get showNavigationButtons() {
      return state.showNavigationButtons;
    },
    set showNavigationButtons(show: boolean) {
      setStyles({
        '--nav-button-display': show ? 'block !important' : 'none !important',
      });
      setState({ showNavigationButtons: show });
    },
    get type() {
      return '$w.Slideshow';
    },
    toJSON() {
      const { currentIndex, type } = sdkProps;
      return {
        ...toJSONBase(metaData),
        type,
        currentIndex,
        showNavigationButtons: state.showNavigationButtons,
        showSlideButtons: state.showSlideButtons,
      };
    },
  };

  return sdkProps;
};

const slideShowContainerSDKFactory = withValidation(
  _slideShowContainerSDKFactory,
  {
    type: ['object'],
    properties: {
      changeSlide: {
        type: ['function'],
        args: [
          {
            type: ['object', 'integer'],
          },
        ],
      },
      showSlideButtons: {
        type: ['boolean'],
      },
      showNavigationButtons: {
        type: ['boolean'],
      },
    },
  },
  {
    changeSlide: [isValidSlideReference],
  },
);
const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories<
  SlideShowContainerProps,
  ISlideShowContainerSDK
>([
  elementPropsSDKFactory,
  changePropsSDKFactory,
  clickPropsSDKFactory,
  childrenPropsSDKFactory,
  playablePropsSDKFactory,
  slideShowContainerSDKFactory,
]);

export default createComponentSDKModel(sdk);
