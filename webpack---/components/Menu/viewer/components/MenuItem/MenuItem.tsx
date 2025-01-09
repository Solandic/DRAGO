import React, { useEffect, useRef } from 'react';
import classNames from 'clsx';
import type {
  DropdownAnimationNameType,
  IMenuItemProps,
  MenuPreviewStateMap,
} from '../../../Menu.types';
import { MenuItemContext } from '../../../../../common/menu/MenuItemContext';
import { createEventListeners } from './utils';
import classes from './style/MenuItem.scss';
import {
  MENU_ITEM_ANIMATION_CONFIG,
  MenuParts,
  INITIAL_ANIMATION_STATE,
  ANIMATION_PACKAGE_CONFIG,
} from '../../constants';
import { Dropdown } from '../Dropdown';
import type { MenuItemProps } from '@wix/editor-elements-definitions';
import { MenuItemLabel } from './MenuItemLabel';
import { isEmptyObject } from '@wix/editor-elements-common-utils';
import type { AnimationState } from './useAnimationState';
import { useAnimationState } from './useAnimationState';
import { useDropdown } from './useDropdown';

type HorizontalDropdownProps = {
  onEscKeyDown: () => void;
  item: MenuItemProps;
  currentItem?: MenuItemProps;
  children?: React.ReactNode;
  dropdownAnimationState: AnimationState<DropdownAnimationNameType>;
};

type VerticalDropdownProps = {
  open: boolean;
  onEscKeyDown: () => void;
  item: MenuItemProps & {
    forceOpen?: boolean;
    children?: React.ReactNode | undefined;
  };
  currentItem?: MenuItemProps;
  partToPreviewStateMap?: MenuPreviewStateMap;
  dropdownAnimationState: AnimationState<DropdownAnimationNameType>;
};

function HorizontalDropdown(props: HorizontalDropdownProps) {
  return (
    <MenuItemContext.Provider
      value={{
        onEscKeyDown: props.onEscKeyDown,
        item: props.item,
        currentItem: props.currentItem,
        dropdownAnimationState: props.dropdownAnimationState,
      }}
    >
      <Dropdown
        className={classes.horizontalDropdownDisplayWrapper}
        children={props.children}
        item={props.item}
        menuOrientation="horizontal"
      />
    </MenuItemContext.Provider>
  );
}

function VerticalDropdown(props: VerticalDropdownProps) {
  return (
    <MenuItemContext.Provider
      value={{
        onEscKeyDown: props.onEscKeyDown,
        item: props.item,
        currentItem: props.currentItem,
        dropdownAnimationState: props.dropdownAnimationState,
      }}
    >
      <Dropdown
        item={props.item}
        menuOrientation="vertical"
        className={classNames(
          classes.verticalDropdownDisplayWrapper,
          props.open && classes.expandedDropdown,
        )}
        partToPreviewStateMap={props.partToPreviewStateMap}
      />
    </MenuItemContext.Provider>
  );
}

export const MenuItem: React.FC<IMenuItemProps> = props => {
  const {
    item,
    currentItem,
    focusOnMenuItem,
    getAnimationPackage,
    partToPreviewStateMap,
  } = props;
  const { children, forceOpen = false } = item;

  const { animationState, initEnterAnimation, initExitAnimation } =
    useAnimationState(MENU_ITEM_ANIMATION_CONFIG, INITIAL_ANIMATION_STATE);

  const hasSubItems = !!item.items?.length;
  const hasMegaMenuContainer = !!children;
  const hasDropdownMenu = hasMegaMenuContainer || hasSubItems;
  const hasLink = !isEmptyObject(item.link);

  const chevronButtonRef = useRef<HTMLButtonElement>(null);

  const itemRef = useRef<HTMLLIElement>(null);

  const getMenuItemAnimationName = () => {
    const animationPackage = getAnimationPackage();
    const menuItemAnimationName =
      ANIMATION_PACKAGE_CONFIG[animationPackage].menuItemAnimationName;

    return menuItemAnimationName;
  };

  const {
    isOpen,
    dropdownAnimationState,
    showDropdown,
    hideDropdown,
    toggleDropdown,
  } = useDropdown({
    itemRef,
    forceOpen,
    getAnimationPackage,
  });

  const eventListeners = createEventListeners({
    showDropdown,
    hideDropdown,
    itemRef,
    getMenuItemAnimationName,
    initEnterAnimation,
    initExitAnimation,
    isOpen,
    hasLink,
    dropdownAnimationState,
  });

  useEffect(() => {
    if (currentItem?.id === item.id && itemRef.current) {
      focusOnMenuItem?.(itemRef.current);
    }
  }, [currentItem, item, focusOnMenuItem]);

  const handleEscKeyDown = () => {
    chevronButtonRef.current?.focus();

    hideDropdown();
  };

  return (
    <li
      ref={itemRef}
      className={classes.listItem}
      data-part={MenuParts.MenuItem}
      data-animation-name={animationState.name}
      data-animation-state={animationState.phase}
      data-item-depth="0" // For scrolling, to know how much items on depth=0
    >
      <div className={classes.itemWrapper} {...eventListeners}>
        <MenuItemLabel
          {...props}
          hasDropdownMenu={hasDropdownMenu}
          hasSubItems={hasSubItems}
          chevronButtonRef={chevronButtonRef}
          toggleDropdown={toggleDropdown}
          isOpen={isOpen}
          dropdownAnimationState={dropdownAnimationState}
        />
        {hasDropdownMenu && (
          <HorizontalDropdown
            onEscKeyDown={handleEscKeyDown}
            item={item}
            currentItem={currentItem}
            children={children}
            dropdownAnimationState={dropdownAnimationState}
          />
        )}
      </div>
      {hasSubItems && (
        <VerticalDropdown
          open={isOpen}
          onEscKeyDown={handleEscKeyDown}
          item={item}
          currentItem={currentItem}
          partToPreviewStateMap={partToPreviewStateMap}
          dropdownAnimationState={dropdownAnimationState}
        />
      )}
      <span className={classes.divider}></span>
    </li>
  );
};
