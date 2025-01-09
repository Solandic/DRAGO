'use-client';
import { useScroll } from '../../../../common/menu/Scroll/useScroll';
import React, { useCallback, useEffect, useMemo } from 'react';
import classNames from 'clsx';
import { formatClassNames } from '@wix/editor-elements-common-utils';
import type { IMenuContentProps } from '../../Menu.types';
import { MenuItem } from '../../viewer/components/MenuItem/MenuItem';
import classes from './style/MenuContent.scss';
import { getCurrentMenuItem } from '../../../../common/menu/getCurrentMenuItem';
import { ScrollControls } from '../../viewer/components/ScrollControls/ScrollControls';
import {
  scrollToMenuItem,
  rootLevelMenuItemSelector,
} from '../../../../common/menu/Scroll/utils';
import { useResizeObserver } from '@wix/thunderbolt-elements/providers/useResizeObserver';
import { semanticClassNames as menuSemanticClassNames } from '../../Menu.semanticClassNames';
import shmSemanticClassNames from '../../../StylableHorizontalMenu/StylableHorizontalMenu.semanticClassNames';
import { useMenuContext } from '../../viewer/MenuContext';
import { DataHooks } from '../../constants';
import { MenuParts } from '../../viewer/constants';

const MenuContent: React.FC<IMenuContentProps> = props => {
  const {
    id,
    className,
    onItemMouseIn,
    onItemMouseOut,
    onItemClick,
    onItemDblClick,
  } = props;

  const {
    items,
    partToPreviewStateMap,
    currentUrl,
    activeAnchor,
    translations,
    customClassNames = [],
    getAnimationPackage,
    navAriaLabel,
  } = useMenuContext();

  const rootClassName = classNames(
    classes.root,
    formatClassNames(shmSemanticClassNames.root),
    formatClassNames(menuSemanticClassNames.root, ...customClassNames),
  );

  const menuContainerRef = React.useRef<HTMLElement>(null); // for DOM measurements

  const currentItem = useMemo(
    () => getCurrentMenuItem(items, activeAnchor, currentUrl),
    [items, activeAnchor, currentUrl],
  );

  const {
    isScrollable,
    updateScrollState,
    handleOnScroll,
    handleScrollForward,
    handleScrollBackward,
    isScrollBackwardButtonVisible,
    isScrollForwardButtonVisible,
  } = useScroll(menuContainerRef);

  const focusOnMenuItem = useCallback(
    (menuItem: HTMLElement) => {
      const { current: menuContainer } = menuContainerRef;

      if (!isScrollable || !menuItem || !menuContainer) {
        return;
      }
      const rootMenuItem = menuContainer.closest<HTMLElement>(
        rootLevelMenuItemSelector,
      );
      if (rootMenuItem && rootMenuItem !== menuItem) {
        scrollToMenuItem(menuContainer, rootMenuItem);
      } else {
        scrollToMenuItem(menuContainer, menuItem);
      }
    },
    [isScrollable],
  );

  const handleOnFocus = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      const targetMenuItem = event.target;
      focusOnMenuItem(targetMenuItem);
    },
    [focusOnMenuItem],
  );

  useResizeObserver({
    ref: menuContainerRef,
    callback: updateScrollState,
  });
  useEffect(updateScrollState, [items, updateScrollState]);

  return (
    <div id={id} className={className}>
      <nav
        className={rootClassName}
        ref={menuContainerRef}
        {...(isScrollable && {
          onScroll: handleOnScroll,
          onFocus: handleOnFocus,
        })}
        data-part={MenuParts.Navbar}
        data-hook={DataHooks.menuRoot}
        aria-label={navAriaLabel || translations.menuNavAriaLabel}
      >
        <ul className={classes.container}>
          {items.map(item => (
            <MenuItem
              translations={translations}
              currentItem={currentItem}
              item={item}
              key={item.id}
              partToPreviewStateMap={partToPreviewStateMap}
              onItemClick={onItemClick}
              focusOnMenuItem={focusOnMenuItem}
              onItemMouseIn={onItemMouseIn}
              onItemMouseOut={onItemMouseOut}
              onItemDblClick={onItemDblClick}
              getAnimationPackage={getAnimationPackage}
            />
          ))}
        </ul>
        <ScrollControls
          scrollPageForward={handleScrollForward}
          scrollPageToBackward={handleScrollBackward}
          isScrollBackwardButtonShown={isScrollBackwardButtonVisible}
          isScrollForwardButtonShown={isScrollForwardButtonVisible}
          previewState={partToPreviewStateMap?.['scroll-button']}
        />
      </nav>
    </div>
  );
};

export default MenuContent;
