import React, { createContext, useContext, useMemo } from 'react';
import type { MenuItemProps } from '@wix/editor-elements-definitions';
import type { AnimationState } from '../../components/Menu/viewer/components/MenuItem/useAnimationState';
import type { DropdownAnimationNameType } from '../../components/Menu/Menu.types';
import { INITIAL_DROPDOWN_ANIMATION_STATE } from '../../components/Menu/viewer/constants';

export type MenuItemContextValue = {
  item: MenuItemProps;
  currentItem?: MenuItemProps;
  dropdownAnimationState?: AnimationState<DropdownAnimationNameType>;
  onEscKeyDown?: () => void;
  isOpen?: boolean;
};

type MenuItemContextProviderProps =
  React.PropsWithChildren<MenuItemContextValue>;

const emptyItem: MenuItemProps = {
  label: '',
  link: {},
};

export const MenuItemContext = createContext<MenuItemContextValue>({
  item: emptyItem,
  dropdownAnimationState: INITIAL_DROPDOWN_ANIMATION_STATE,
  isOpen: false,
});

export const MenuItemContextProvider: React.FC<
  MenuItemContextProviderProps
> = ({
  children,
  onEscKeyDown,
  item,
  dropdownAnimationState,
  currentItem,
  isOpen,
}) => {
  const contextValue = useMemo(
    () => ({
      onEscKeyDown,
      item,
      dropdownAnimationState,
      currentItem,
      isOpen,
    }),
    [onEscKeyDown, item, dropdownAnimationState, currentItem, isOpen],
  );

  return (
    <MenuItemContext.Provider value={contextValue}>
      {children}
    </MenuItemContext.Provider>
  );
};

export const useMenuItemContext = () => useContext(MenuItemContext);
