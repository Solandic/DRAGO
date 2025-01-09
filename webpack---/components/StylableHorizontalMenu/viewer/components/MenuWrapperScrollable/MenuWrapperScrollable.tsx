import * as React from 'react';
import { debounce } from '@wix/editor-elements-common-utils';
import { useResizeObserver } from '@wix/thunderbolt-elements/providers/useResizeObserver';
import type {
  IMenuWrapperProps,
  IStylableHorizontalMenuImperativeActions,
} from '../../../StylableHorizontalMenu.types';
import { ScrollControls } from '../ScrollControls/ScrollControls';

import { classes } from '../../StylableHorizontalMenu.component.st.css';
import {
  scrollMenuRight,
  scrollMenuLeft,
  scrollToMenuItem,
  rootLevelMenuItemSelector,
  MINIMAL_IMPORTANT_SCROLL_DISTANCE,
} from '../../../../../common/menu/Scroll/utils';

const DEBOUNCE_DURATION = 100;

const _MenuWrapperScrollable: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IMenuWrapperProps
> = (
  {
    items,
    currentItem,
    children,
    className,
    screenReaderHintElement,
    ref: _ref,
    ...restA11yProps
  },
  ref,
) => {
  const menuContainerRef = React.useRef<HTMLElement>(null); // for DOM measurements
  const menuWrapperRef = React.useRef<HTMLUListElement>(null);

  const [isScrollable, setIsScrollable] = React.useState(false); // clientWidth < scrollWidth
  const [isScrollLeftButtonVisible, setIsScrollLeftButtonVisible] =
    React.useState(false); // has hidden item(s) to the left of menu
  const [isScrollRightButtonVisible, setIsScrollRightButtonVisible] =
    React.useState(false); // has hidden item(s) to the right of menu
  const [currentMenuItemIndex, setCurrentMenuItemIndex] = React.useState(-1);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      menuContainerRef.current?.focus();
    },
    blur: () => {
      menuContainerRef.current?.blur();
    },
  }));

  const updateScrollState = React.useCallback(
    () =>
      debounce(() => {
        const { current: nav } = menuContainerRef;

        if (!nav) {
          return;
        }

        const { scrollLeft, scrollWidth, clientWidth } = nav;
        const isMenuScrollable = clientWidth < scrollWidth;

        setIsScrollable(isMenuScrollable);
        setIsScrollLeftButtonVisible(
          isMenuScrollable && scrollLeft > MINIMAL_IMPORTANT_SCROLL_DISTANCE,
        );
        setIsScrollRightButtonVisible(
          isMenuScrollable &&
            scrollLeft <
              scrollWidth - clientWidth - MINIMAL_IMPORTANT_SCROLL_DISTANCE,
        );
      }, DEBOUNCE_DURATION)(),
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(updateScrollState, []);

  const handleOnScroll = updateScrollState;

  const handleOnFocus = (event: React.FocusEvent<HTMLElement>) => {
    const targetMenuItem = event.target;
    const { current: menuContainer } = menuContainerRef;

    if (!isScrollable || !targetMenuItem || !menuContainer) {
      return;
    }
    const rootMenuItem = menuContainer.closest<HTMLElement>(
      rootLevelMenuItemSelector,
    );
    if (rootMenuItem && rootMenuItem !== targetMenuItem) {
      scrollToMenuItem(menuContainer, rootMenuItem);
    } else {
      scrollToMenuItem(menuContainer, targetMenuItem);
    }
  };

  const scrollActiveMenuItemIntoView = React.useCallback(
    (menuItemIndex: number) => {
      const { current: menuContainerNode } = menuContainerRef;

      if (!menuContainerNode || !isScrollable || menuItemIndex === -1) {
        return;
      }

      setCurrentMenuItemIndex(menuItemIndex);

      const targetMenuItem = Array.from(
        menuContainerNode.querySelectorAll<HTMLElement>(
          rootLevelMenuItemSelector,
        ),
      )[menuItemIndex];
      if (targetMenuItem) {
        scrollToMenuItem(menuContainerNode, targetMenuItem);
      }
    },
    [isScrollable],
  );

  React.useEffect(() => {
    const selectedMenuItem =
      items.find(item => item.forceHovered) || currentItem;
    const selectedMenuItemIndex = selectedMenuItem
      ? items.indexOf(selectedMenuItem)
      : -1;
    if (selectedMenuItemIndex !== currentMenuItemIndex) {
      scrollActiveMenuItemIntoView(selectedMenuItemIndex);
    }
  }, [items, currentMenuItemIndex, scrollActiveMenuItemIntoView, currentItem]);

  const handleScrollPageToTheLeft = (): void => {
    if (!menuContainerRef.current || !isScrollable) {
      return;
    }

    scrollMenuLeft(menuContainerRef.current);
  };

  const handleScrollPageToTheRight = (): void => {
    if (!menuContainerRef.current || !isScrollable) {
      return;
    }

    scrollMenuRight(menuContainerRef.current);
  };

  useResizeObserver({
    ref: menuContainerRef,
    callback: updateScrollState,
  });

  return (
    <nav
      tabIndex={-1}
      className={className}
      ref={menuContainerRef}
      {...(isScrollable && {
        onScroll: handleOnScroll,
        onFocus: handleOnFocus,
      })}
      {...restA11yProps}
    >
      {screenReaderHintElement}
      <ul className={classes.menu} ref={menuWrapperRef}>
        {children}
      </ul>
      <ScrollControls
        scrollPageToTheRight={handleScrollPageToTheRight}
        scrollPageToTheLeft={handleScrollPageToTheLeft}
        isScrollLeftButtonShown={isScrollLeftButtonVisible}
        isScrollRightButtonShown={isScrollRightButtonVisible}
      />
    </nav>
  );
};

export const MenuWrapperScrollable = React.forwardRef(_MenuWrapperScrollable);
