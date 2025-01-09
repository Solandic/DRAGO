import {
  DropdownAnimationName,
  HamburgerMenuAnimationName,
  MenuAnimationName,
} from '../constants';
import type {
  DropdownAnimationConfig,
  DropdownAnimationNameType,
  HamburgerMenuAnimationConfig,
  HamburgerMenuAnimationNameType,
  MenuAnimationNameType,
  MenuItemAnimationConfig,
  Translations,
} from '../Menu.types';
import type { AnimationState } from './components/MenuItem/useAnimationState';

/**
 * The viewer will duplicate the styles of the menu component onto an id with this prefix
 * used to pass CSS variables from top-level menu to MenuContent inside of HamburgerOverlay portal
 */
export const MENU_CONTENT_ID_PREFIX = 'portal-';

export const defaultTranslations: Translations['translations'] = {
  menuNavAriaLabel: 'Site',
  dropdownButtonAriaLabel: 'More pages',
};
export const MENU_ITEM_ANIMATION_CONFIG: Record<
  MenuAnimationNameType,
  MenuItemAnimationConfig
> = {
  [MenuAnimationName.None]: {
    name: MenuAnimationName.None,
    duration: 0,
  },
  [MenuAnimationName.Underline]: {
    name: MenuAnimationName.Underline,
    duration: 300,
  },
  [MenuAnimationName.Wash]: {
    name: MenuAnimationName.Wash,
    duration: 400,
  },
  [MenuAnimationName.Bullet]: {
    name: MenuAnimationName.Bullet,
    duration: 300,
  },
  [MenuAnimationName.Wave]: {
    name: MenuAnimationName.Wave,
    duration: 400,
  },
  [MenuAnimationName.Circle]: {
    name: MenuAnimationName.Circle,
    duration: 400,
  },
  [MenuAnimationName.Bounce]: {
    name: MenuAnimationName.Bounce,
    duration: 400,
  },
  [MenuAnimationName.Tint]: {
    name: MenuAnimationName.Tint,
    duration: 400,
  },
  [MenuAnimationName.TextWash]: {
    name: MenuAnimationName.TextWash,
    duration: 400,
  },
  [MenuAnimationName.Wobble]: {
    name: MenuAnimationName.Wobble,
    duration: 400,
  },
  [MenuAnimationName.Brackets]: {
    name: MenuAnimationName.Brackets,
    duration: 400,
  },
  [MenuAnimationName.Float]: {
    name: MenuAnimationName.Float,
    duration: 400,
  },
  [MenuAnimationName.Shape]: {
    name: MenuAnimationName.Shape,
    duration: 400,
  },
  [MenuAnimationName.Expand]: {
    name: MenuAnimationName.Expand,
    duration: 400,
  },
  [MenuAnimationName.Shadow]: {
    name: MenuAnimationName.Shadow,
    duration: 400,
  },
  [MenuAnimationName.LineRise]: {
    name: MenuAnimationName.LineRise,
    duration: 400,
  },
  [MenuAnimationName.Overline]: {
    name: MenuAnimationName.Overline,
    duration: 400,
  },
  [MenuAnimationName.CenterLine]: {
    name: MenuAnimationName.CenterLine,
    duration: 400,
  },
  [MenuAnimationName.Skew]: {
    name: MenuAnimationName.Skew,
    duration: 400,
  },
  [MenuAnimationName.Point]: {
    name: MenuAnimationName.Point,
    duration: 400,
  },
  [MenuAnimationName.Blur]: {
    name: MenuAnimationName.Blur,
    duration: 400,
  },
};

export const DROPDOWN_ANIMATION_CONFIG: Record<
  DropdownAnimationNameType,
  DropdownAnimationConfig
> = {
  [DropdownAnimationName.None]: {
    name: DropdownAnimationName.None,
    duration: 0,
  },
  [DropdownAnimationName.RevealFromTop]: {
    name: DropdownAnimationName.RevealFromTop,
    duration: 400,
  },
  [DropdownAnimationName.FadeIn]: {
    name: DropdownAnimationName.FadeIn,
    duration: 400,
  },
};

export const HAMBURGER_MENU_ANIMATION_CONFIG: Record<
  HamburgerMenuAnimationNameType,
  HamburgerMenuAnimationConfig
> = {
  [HamburgerMenuAnimationName.None]: {
    name: HamburgerMenuAnimationName.None,
    duration: 0,
  },
  [HamburgerMenuAnimationName.RevealFromRight]: {
    name: HamburgerMenuAnimationName.RevealFromRight,
    duration: 400,
  },
  [HamburgerMenuAnimationName.FadeIn]: {
    name: HamburgerMenuAnimationName.FadeIn,
    duration: 400,
  },
};

export const ANIMATION_PACKAGE_CONFIG = {
  [MenuAnimationName.None]: {
    menuItemAnimationName: MenuAnimationName.None,
    dropdownAnimationName: DropdownAnimationName.None,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.None,
  },
  [MenuAnimationName.Underline]: {
    menuItemAnimationName: MenuAnimationName.Underline,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Wash]: {
    menuItemAnimationName: MenuAnimationName.Wash,
    dropdownAnimationName: DropdownAnimationName.FadeIn,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.FadeIn,
  },
  [MenuAnimationName.Bullet]: {
    menuItemAnimationName: MenuAnimationName.Bullet,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Wave]: {
    menuItemAnimationName: MenuAnimationName.Wave,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Circle]: {
    menuItemAnimationName: MenuAnimationName.Circle,
    dropdownAnimationName: DropdownAnimationName.FadeIn,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.FadeIn,
  },
  [MenuAnimationName.Bounce]: {
    menuItemAnimationName: MenuAnimationName.Bounce,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Tint]: {
    menuItemAnimationName: MenuAnimationName.Tint,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.TextWash]: {
    menuItemAnimationName: MenuAnimationName.TextWash,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Wobble]: {
    menuItemAnimationName: MenuAnimationName.Wobble,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Brackets]: {
    menuItemAnimationName: MenuAnimationName.Brackets,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Float]: {
    menuItemAnimationName: MenuAnimationName.Float,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Shape]: {
    menuItemAnimationName: MenuAnimationName.Shape,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Expand]: {
    menuItemAnimationName: MenuAnimationName.Expand,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Shadow]: {
    menuItemAnimationName: MenuAnimationName.Shadow,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.LineRise]: {
    menuItemAnimationName: MenuAnimationName.LineRise,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Overline]: {
    menuItemAnimationName: MenuAnimationName.Overline,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.CenterLine]: {
    menuItemAnimationName: MenuAnimationName.CenterLine,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Skew]: {
    menuItemAnimationName: MenuAnimationName.Skew,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Point]: {
    menuItemAnimationName: MenuAnimationName.Point,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
  [MenuAnimationName.Blur]: {
    menuItemAnimationName: MenuAnimationName.Blur,
    dropdownAnimationName: DropdownAnimationName.RevealFromTop,
    hamburgerMenuAnimationName: HamburgerMenuAnimationName.RevealFromRight,
  },
};

export const INITIAL_ANIMATION_STATE: AnimationState<MenuAnimationNameType> = {
  name: MenuAnimationName.None,
};

export const INITIAL_DROPDOWN_ANIMATION_STATE: AnimationState<DropdownAnimationNameType> =
  {
    name: DropdownAnimationName.None,
  };

export const INITIAL_HAMBURGER_MENU_ANIMATION_STATE: AnimationState<HamburgerMenuAnimationNameType> =
  {
    name: HamburgerMenuAnimationName.None,
  };

export const MenuParts = {
  Navbar: 'navbar',
  DropdownContainer: 'dropdown-container',
  DropdownIcon: 'dropdown-icon',
  Label: 'label',
  DropdownItem: 'dropdown-item',
  DropdownItemLabel: 'dropdown-item-label',
  DropdownSubItem: 'dropdown-subitem',
  DropdownSubItemLabel: 'dropdown-subitem-label',
  MenuItem: 'menu-item',
  MenuItemContent: 'menu-item-content',
  MenuItemLink: 'menu-item-link',
  HamburgerMenuContainer: 'hamburger-menu-container',
  HamburgerOverlay: 'hamburger-overlay',
  ScrollBackwardButton: 'scroll-backward-button',
  ScrollForwardButton: 'scroll-forward-button',
} as const;
