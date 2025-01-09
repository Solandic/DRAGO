import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import type {
  IMenuProps,
  MenuAnimationNameType,
  MenuItemWithChildren,
} from '../Menu.types';
import { defaultTranslations } from './constants';
import { MenuAnimationName } from '../constants';

const EMPTY_ANCHOR_URL = '#';

export type MenuContextValue = Pick<
  IMenuProps,
  | 'partToPreviewStateMap'
  | 'currentUrl'
  | 'activeAnchor'
  | 'translations'
  | 'customClassNames'
  | 'navAriaLabel'
> & {
  items: Array<MenuItemWithChildren>;
  menuStyleId: string; // id that css variables are applied on
  getAnimationPackage: () => MenuAnimationNameType;
};

export const MenuContext = createContext<MenuContextValue>({
  items: [],
  currentUrl: EMPTY_ANCHOR_URL,
  translations: defaultTranslations,
  menuStyleId: '',
  customClassNames: [],
  getAnimationPackage: () => MenuAnimationName.None,
  navAriaLabel: '',
});

export const useMenuContext = () => useContext(MenuContext);

export const MenuContextProvider: React.FC<
  PropsWithChildren<MenuContextValue>
> = ({
  children,
  items,
  partToPreviewStateMap,
  currentUrl,
  activeAnchor,
  translations,
  menuStyleId,
  customClassNames,
  getAnimationPackage,
  navAriaLabel,
}) => {
  const contextValue = useMemo<MenuContextValue>(
    () => ({
      items,
      partToPreviewStateMap,
      currentUrl,
      activeAnchor,
      translations,
      menuStyleId,
      customClassNames,
      getAnimationPackage,
      navAriaLabel,
    }),
    [
      items,
      partToPreviewStateMap,
      currentUrl,
      activeAnchor,
      translations,
      menuStyleId,
      customClassNames,
      getAnimationPackage,
      navAriaLabel,
    ],
  );

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
};
