export const DataType = 'MenuData';
export const MenuRef = '#CUSTOM_MAIN_MENU';
export const ViewerType = 'wixui.Menu';
export const LayerPanelIconLabel = 'HorizontalMenu';

import type { JustifyAlignment } from '@wix/editor-elements-common-utils';
import { DISABLED_ANIMATION_NAME } from './viewer/components/MenuItem/useAnimationState';

export const MenuOrientation = {
  Horizontal: 'horizontal',
  Vertical: 'vertical',
} as const;
export const MenuJustification = {
  Justify: 'justify',
  None: 'none',
} as const;
export const VerticalDropdownDisplay = {
  AlwaysOpen: 'alwaysOpen',
  ExpandCollapse: 'expandCollapse',
} as const;
export const MenuOverflow = {
  Scroll: 'scroll',
  Wrap: 'wrap',
} as const;
export const MenuDisplayMode = {
  Navbar: 'navbar',
  Hamburger: 'hamburger',
};
export const MenuAlignment: Record<string, JustifyAlignment> = {
  Start: 'start',
  Center: 'center',
  End: 'end',
  Justify: 'justify',
} as const;
export const ItemTextAlignment = {
  Left: 'left',
  Center: 'center',
  Justify: 'justify',
  Right: 'right',
} as const;
export const DropdownAnchor = {
  menuItem: 'menuItem',
  menuStretched: 'menuStretched',
  menuCustomWidth: 'menuCustomWidth',
  screen: 'screen',
} as const;

export const MenuAnimationName = {
  None: DISABLED_ANIMATION_NAME,
  Underline: 'underline',
  Wash: 'wash',
  Bullet: 'bullet',
  Wave: 'wave',
  Bounce: 'bounce',
  Tint: 'tint',
  TextWash: 'textWash',
  Wobble: 'wobble',
  Brackets: 'brackets',
  Float: 'float',
  Shape: 'shape',
  Expand: 'expand',
  Circle: 'circle',
  Shadow: 'shadow',
  LineRise: 'lineRise',
  Overline: 'overline',
  CenterLine: 'centerLine',
  Skew: 'skew',
  Point: 'point',
  Blur: 'blur',
} as const;

export const DropdownAnimationName = {
  None: DISABLED_ANIMATION_NAME,
  RevealFromTop: 'revealFromTop',
  FadeIn: 'fadeIn',
} as const;

export const HamburgerMenuAnimationName = {
  None: DISABLED_ANIMATION_NAME,
  RevealFromRight: 'revealFromRight',
  FadeIn: 'fadeIn',
} as const;

export const MenuScrollButtonDisplay = {
  Hide: 'none',
  Show: 'unset',
};

export const TranslationKeys = {
  labelDisplayName: 'menu_definition_label_display_name',
  gfppManageLabel: 'menu_gfpp_manage_label',
  gfppHelpResponsive: 'menu_help_gfpp',
  settingsPanel: {
    title: 'menu_settings_header_label',
    animationPackagePickerLabel: 'menu_settings_animations_label',
    animationOptions: {
      None: 'menu_settings_animations_thumbnail_none',
      Underline: 'menu_settings_animations_thumbnail_underline',
      Wash: 'menu_settings_animations_thumbnail_wash',
      Bullet: 'menu_settings_animations_thumbnail_bullet',
      Wave: 'menu_settings_animations_thumbnail_wave',
      Bounce: 'menu_settings_animations_thumbnail_bounce',
      Tint: 'menu_settings_animations_thumbnail_tint',
      TextWash: 'menu_settings_animations_thumbnail_text_wash',
      Wobble: 'menu_settings_animations_thumbnail_shake',
      Brackets: 'menu_settings_animations_thumbnail_brackets',
      Float: 'menu_settings_animations_thumbnail_float',
      Shape: 'menu_settings_animations_thumbnail_shape',
      Expand: 'menu_settings_animations_thumbnail_expand',
      Circle: 'menu_settings_animations_thumbnail_circle',
      Shadow: 'menu_settings_animations_thumbnail_shadow',
      LineRise: 'menu_settings_animations_thumbnail_line_reveal',
      Overline: 'menu_settings_animations_thumbnail_overline',
      CenterLine: 'menu_settings_animations_thumbnail_center_line',
      Skew: 'menu_settings_animations_thumbnail_skew',
      Point: 'menu_settings_animations_thumbnail_point',
      Blur: 'menu_settings_animations_thumbnail_blur',
    },
    navAriaLabel: {
      inputLabel: 'menu_settings_accessible_name_label',
      infoTooltip: 'menu_settings_accessible_name_tooltip',
      defaultValue: 'menu_settings_accessible_name_default_text',
    },
  },
  layoutPanel: {
    vertical: {
      AlwaysOpen: 'menu_layout_dropdown_tab_item_display_open',
      ExpandCollapse: 'menu_layout_dropdown_tab_item_display_collapsed',
      VerticalDropdownDisplay: 'menu_layout_dropdown_tab_item_display_label',
    },
    horizontal: {
      Scroll: 'menu_layout_overflow_scroll',
      Wrap: 'menu_layout_overflow_wrap',
      ShowScrollIcon: 'menu_layout_scroll_toggle_label',
      ShowScrollIconTooltip: 'menu_layout_scroll_toggle_tooltip',
      ShowDropdownIcon: 'menu_layout_dropdown_toggle_label',
      ShowDropdownIconTooltip: 'menu_layout_dropdown_toggle_tooltip',
      OverflowItems: 'menu_layout_overflow_label',
      ScrollTooltip: 'menu_layout_overflow_tooltip',
    },
    layoutDropdownNotification:
      'Menu_layout_dropdown_tab_all_dropdowns_notification',
    layoutDropdownNotificationLink:
      'menu_layout_dropdown_tab_all_dropdowns_notification_text_link',
    layoutDropdownNotificationTooltip:
      'menu_layout_dropdown_tab_all_dropdowns_notification_tooltip',
    dropdown: {
      Width: 'menu_layout_dropdown_tab_width_label',
      WidthOptions: {
        HugContent: 'menu_layout_dropdown_tab_width_content',
        FitToMenu: 'menu_layout_dropdown_tab_width_menu',
        Stretch: 'menu_layout_dropdown_tab_width_stretch',
        Custom: 'menu_layout_dropdown_tab_width_custom',
      },
      ContainerAlignment: 'Menu_layout_dropdown_tab_container_alignment',
      ContainerMargins: 'menu_layout_dropdown_tab_margins_label',
      SpaceAboveContainer: 'menu_layout_dropdown_tab_space_above_label',
    },
    MenuLayout: 'menu_layout_header_label',
    Menu: 'menu_layout_tab_menu_label',
    Dropdown: 'menu_layout_tab_dropdown_label',
    MenuType: 'menu_layout_type_label',
    NavigationBar: 'menu_layout_type_navbar',
    Hamburger: 'menu_layout_type_hamburger',
    Orientation: 'menu_layout_display_label',
    Horizontal: 'menu_layout_display_horizontal',
    Vertical: 'menu_layout_display_vertical',
    SpaceBetweenItems: 'menu_layout_spacing_label',
    ItemPadding: 'menu_layout_padding_label',
    MenuPadding: 'menu_layout_menu_padding_label',
    Add_dividers: 'menu_layout_dividers_toggle',
    Space_between_items_divider: 'menu_layout_spacing_divider_label',
    Space_between_text_icon: 'menu_layout_spacing_icon_label',
    ScrollButtonPadding: 'menu_layout_scroll_button_padding_label',
  },
  designPanel: {
    title: 'menu_design_header_label',
    itemPart: 'menu_design_part_selection_items',
    containerPart: 'menu_design_part_selection_container',
    scrollButtonPart: 'menu_design_part_selection_scroll',
  },
  commonBanner: {
    learnMore: 'menu_layout_dropdown_tab_all_dropdowns_notification_text_link',
    allAttachedText: 'Menu_layout_dropdown_tab_all_dropdowns_notification',
    allAttachedTooltip:
      'menu_layout_dropdown_tab_all_dropdowns_notification_tooltip',
    someAttachedText: 'menu_layout_dropdown_tab_some_dropdowns_notification',
    someAttachedTooltip:
      'menu_layout_dropdown_tab_some_dropdowns_notification_tooltip',
    allDetachedText: 'menu_layout_dropdown_tab_no_dropdowns_notification',
    allDetachedTooltip:
      'menu_layout_dropdown_tab_no_dropdowns_notification_tooltip',
  },
};

export const helpIds = {
  settingsPanel: '6f5d36a8-f67b-45d6-8eaa-5db082accb10',
  layoutPanel: '7409b4bd-49e6-4e97-baec-946f27cf1dec',
  gfpp: 'bdb7f8f8-3c5e-4dbf-8865-d3d88e86d5fd',
  commonBannerLearnMore: '6661a7b9-ddca-4763-a502-c92d398fc77c',
};

export const MenuLayoutPanelParts = {
  Menu: 1,
  Dropdown: 2,
};

export const DataHooks = {
  settingsPanel: {
    animationPackagePicker: 'animation-package-picker',
    animationPackage: 'animation-package',
    navAriaLabelInput: 'nav-aria-label-input',
  },
  layoutPanel: {
    navbar: 'navbar_mode',
    hamburger: 'hamburger_mode',
    displayMode: 'display_mode',
    menu: 'menu_tab',
    dropdown: 'dropdown_tab',
    vertical: {
      verticalDropdownDisplay: 'vertical-dropdown-display',
    },
    horizontal: {
      overflowThumbnails: 'overflow-thumbnails',
      overflowLabel: 'overflow-label',
      showScrollButton: 'show-scroll-button',
      showScrollButtonLabel: 'show-scroll-button-label',
      showDropDownIcon: 'show-dropdown-icon',
      showDropDownIconLabel: 'show-dropdown-icon-label',
    },
    orientationThumbnails: 'orientation-thumbnails',
    addDividers: 'add-dividers',
    horizontalSpacingBetweenItems: 'horizontal-spacing-between-items',
    spaceBetweenItemsDivider: 'space-between-items-divider',
    verticalSpacingBetweenItems: 'vertical-spacing-between-items',
    spacingBetweenItems: 'spacing-between-items',
    spacingBetweenTextAndDropdownIcon: 'spacing-between-text-and-dropdown-icon',
    paddingItem: 'padding-item',
    paddingMenu: 'padding-menu',
    horizontalScrollButtonPadding: 'horizontal-scroll-button-padding',
    direction: 'direction',
    alignment: 'alignment',
  },
  menuRoot: 'menu-root',
};

export const ComponentMetaData = {
  labelDisplayName: TranslationKeys.labelDisplayName,
  componentType: ViewerType,
  dataType: DataType,
  nickName: 'menu',
  skinName: 'wixui.skins.Menu',
};
