import { MINIMAL_IMPORTANT_SCROLL_DISTANCE, scrollMenu } from './utils';
import { debounce } from '@wix/editor-elements-common-utils';
import { useCallback, useState } from 'react';

const DEBOUNCE_DURATION = 100;

export const useScroll = (ref: React.RefObject<HTMLElement>) => {
  const [isScrollable, setIsScrollable] = useState(false); // clientWidth < scrollWidth
  const [isScrollBackwardButtonVisible, setIsScrollBackwardButtonVisible] =
    useState(false); // has hidden menu item(s) in the left side
  const [isScrollForwardButtonVisible, setIsScrollForwardButtonVisible] =
    useState(false); // has hidden menu item(s) in the right side

  const handleScrollBackward = useCallback((): void => {
    if (ref.current && isScrollable) {
      scrollMenu(ref.current, 'backward');
    }
  }, [isScrollable, ref]);

  const handleScrollForward = useCallback((): void => {
    if (ref.current && isScrollable) {
      scrollMenu(ref.current, 'forward');
    }
  }, [isScrollable, ref]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateScrollState = useCallback(
    debounce(() => {
      const { current: nav } = ref;
      if (!nav) {
        return;
      }
      const { scrollWidth, clientWidth } = nav;
      const scrollLeft = Math.abs(nav.scrollLeft);
      const isMenuScrollable = clientWidth < scrollWidth;
      setIsScrollable(isMenuScrollable);
      setIsScrollBackwardButtonVisible(
        isMenuScrollable && scrollLeft > MINIMAL_IMPORTANT_SCROLL_DISTANCE,
      );
      setIsScrollForwardButtonVisible(
        isMenuScrollable &&
          scrollLeft <
            scrollWidth - clientWidth - MINIMAL_IMPORTANT_SCROLL_DISTANCE,
      );
    }, DEBOUNCE_DURATION),
    [],
  );

  const updateScrolledLeftCSSVar = useCallback(() => {
    const { current: nav } = ref;
    if (!nav) {
      return;
    }

    nav.style.setProperty('--scrolled-left', `${-nav.scrollLeft}px`);
  }, [ref]);

  const handleOnScroll = useCallback(() => {
    updateScrollState();
    updateScrolledLeftCSSVar();
  }, [updateScrollState, updateScrolledLeftCSSVar]);

  return {
    isScrollable,
    updateScrollState,
    handleOnScroll,
    handleScrollForward,
    handleScrollBackward,
    isScrollBackwardButtonVisible,
    isScrollForwardButtonVisible,
  };
};
