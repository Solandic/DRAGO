import type { MenuItemProps } from './StylableHorizontalMenu.types';

export const LayerPanelIconLabel = 'HorizontalMenu' as const;

export const ViewerType = 'wixui.StylableHorizontalMenu' as const;
export const PropertiesType = 'StylableHorizontalMenuProperties';

export const automationId = 'gfpp-button-manage-menu';
export const responsiveAddPanelAutomationId = 'SHM-add-panel-editor-x';
export const TranslationKeys = {
  label: 'component_label_stylable_horizontal_menu',
  settingsPanel: {
    header: 'Custom_Menu_Empty_State_Header',
  },
  layoutPanel: {
    header: 'StylablePanel_Layout_Horizontal_Menu_Header',
    menuTab: 'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Menu',
    submenuTab_submenu:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu',
    submenuTab_dropdown:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Dropdown',
    megaMenuTab:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_SubmenuContainer',
    menuModeTitle:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Display_Items_Label',
    menuModeTooltip:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Display_Items_Tooltip',
    menuModeOptionWrap:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Display_Items_Option_Wrap',
    menuModeOptionScroll:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Display_Items_Option_Scroll',
    rowSpacing:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Spacing_Categories',
    columnsAlignment:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Alignment_Label',
    columnsAlignmentLeft: 'StylablePanel_Design_Layout_Alignment_Left',
    columnsAlignmentCenter: 'StylablePanel_Design_Layout_Alignment_Center',
    columnsAlignmentRight: 'StylablePanel_Design_Layout_Alignment_Right',
    columnsAlignmentJustify: 'StylablePanel_Design_Layout_Alignment_Justify',
    columnsAmount:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Set_Number_Columns_Label',
    columnsVerticalSpacing:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Items_Spacing_Label',
    horizontalSpacing:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Spacing_Label',
    columnsSectionTitle:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Section_Title',
    columnsStretch:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Stretch_Columns_Label',
    columnsStretchTooltip:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Stretch_Columns_Tooltip',
    columnsStretchTooltipLink:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Stretch_Columns_Tooltip_Link',
    columnsStretchPageOption:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Stretch_Columns_Page',
    columnsStretchScreenOption:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Stretch_Columns_Screen',
    columnsWidth:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Total_Width_Label',
    columnsWidthTooltipLink:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Total_Width_Tooltip_Link',
    columnsWidthStretchedTooltip:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Total_Width_Tooltip_Submenu_Stretched',
    columnsWidthUnstretchedTooltip_submenu:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Total_Width_Tooltip_Submenu_Unstretched',
    columnsWidthUnstretchedTooltip_dropdown:
      'StylablePanel_Design_Horizontal_Menu_Layout_DropDown_Total_Width_Tooltip_Submenu_Unstretched',
    itemsAlignment:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Items_Alignment_Label',
    itemsDirection:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Items_Direction_Label',
    itemsDirectionTooltip:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Items_Direction_Tooltip',
    areItemsFluid:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Items_Stretch_Label',
    itemsHorizontalSpacingWrap:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Items_Spacing_Horizontal_Label',
    itemsHorizontalSpacingScroll:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Items_Spacing_Label',
    itemsVerticalSpacing:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Items_Spacing_Vertical_Label',
    itemsSectionTitle:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Spacing_Alignment_Section_Title',
    displayLtr:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Items_Direction_LtoR',
    displayRtl:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Items_Direction_RtoL',
    flyoutAlignment_submenu:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu_Flyout_Alignment',
    flyoutAlignment_dropdown:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_DropDown_Flyout_Alignment',
    headingSpacing:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Spacing_Levels_1_2',
    gridHorizontalSpacing:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Rows_Spacing_Label',
    menuTextAlignment:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Text_Alignment_Label',
    menuItemSizeSectionTitle:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Item_Padding_Section_Title',
    menuVerticalPadding:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Item_Padding_Vertical_Label',
    menuHorizontalPadding:
      'StylablePanel_Design_Horizontal_Menu_Layout_MainMenu_Item_Padding_Horizontal_Label',
    stretchToFullWidth:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Stretch_Label',
    submenuHorizontalMargin:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Margins_Label',
    submenuEmptyStateTitle_submenu:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu_Empty_State_Title',
    submenuEmptyStateTitle_dropdown:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Dropdown_Empty_State_Title',
    megamenuEmptyStateTitle:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_MegaMenu_Empty_State_Title',
    submenuEmptyStateText1_submenu:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu_Empty_State_Text1',
    submenuEmptyStateText1_dropdown:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Dropdown_Empty_State_Text1',
    megamenuEmptyStateText1:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_MegaMenu_Empty_State_Text1',
    submenuEmptyStateManageMenuLink:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu_Empty_State_Manage_Menu_Link',
    submenuEmptyStateManagePagesLink:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu_Empty_State_Pages_Link',
    megaMenuEmptyStateManageMenuLink:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_MegaMenu_Empty_State_Manage_Menu_Link',
    submenuModeTitle_submenu:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu_Type_Label',
    submenuModeTitle_dropdown:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Dropdown_Type_Label',
    submenuModeOptionFlyout:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu_Type_Option_Flyout',
    submenuModeOptionColumn:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu_Type_Option_Columns',
    submenuModeVerticalSpacing:
      'StylablePanel_Design_Horizontal_Menu_Layout_Tab_Submenu_Flyout_Vertical_Spacing_Label',
    submenuTextAlignment:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Text_Alignment_Label',
    submenuItemsSectionTitle:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Items_Spacing_Padding_Section_Title',
    submenuVerticalPadding:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Item_Padding_Vertical_Label',
    submenuHorizontalPadding:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Item_Padding_Horizontal_Label',
    submenuOrder:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Order_Label',
    submenuOrderVertically:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Order_Vertically',
    submenuOrderHorizontally:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Order_Horizontally',
    submenuSpacing_submenu:
      'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Spacing_Menu_Submenu_Label',
    submenuSpacing_dropdown:
      'StylablePanel_Design_Horizontal_Menu_Layout_Dropdown_Spacing_Menu_Dropdown_Label',

    submenuLayout: {
      stretch: {
        header_submenu: 'custom_menu_layout_submenu_divider_label',
        header_dropdown: 'custom_menu_layout_dropdown_divider_label',

        isStretchedLabel: 'custom_menu_layout_submenu_container_width_title',
        isStretchedValue_unstretched:
          'custom_menu_layout_submenu_container_width_thumbnail1_label',
        isStretchedValue_stretched:
          'custom_menu_layout_submenu_container_width_thumbnail2_label',

        // in editor-x we render toggle instead of thumbnails
        isStretchedToggleLabel: 'mega_menu_container_layout_stretch_toggle',
        isStretchedToggleInfo: undefined,

        // stretch mode - stretch to page or stretch to screen
        stretchModeLabel: 'custom_menu_layout_submenu_stretch_title',
        stretchModeValue_fullScreen:
          'custom_menu_layout_submenu_stretch_radio_button_1',
        stretchModeValue_pageWidth:
          'custom_menu_layout_submenu_stretch_radio_button_2',

        horizontalMarginInfo_submenu:
          'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Columns_Margins_Tooltip',
        horizontalMarginInfo_dropdown:
          'StylablePanel_Design_Horizontal_Menu_Layout_DropDown_Columns_Margins_Tooltip',
      },
      spacing_label:
        'StylablePanel_Design_Horizontal_Menu_Layout_Submenu_Spacing_Label',
      alignment_section_header:
        'custom_menu_layout_submenu_alignment_divider_label',
      alignment_stretch_toggle_label:
        'custom_menu_layout_submenu_alignment_toggle_label',
    },
    alignment: {
      alignLeft: 'mega_menu_layout_alignment_tooltip_left',
      alignCenter: 'mega_menu_layout_alignment_tooltip_center',
      alignRight: 'mega_menu_layout_alignment_tooltip_right',
    },
    megaMenuLayout: {
      stretch: {
        header: undefined,

        isStretchedLabel: 'mega_menu_container_layout_width_title',
        isStretchedValue_unstretched:
          'mega_menu_container_layout_width_label_menu',
        isStretchedValue_stretched:
          'mega_menu_container_layout_width_stretch_label',

        // in editor-x we render toggle instead of thumbnails
        isStretchedToggleLabel: 'mega_menu_layout_stretch_toggle',
        isStretchedToggleInfo: 'mega_menu_layout_stretch_toggle_tooltip',

        // stretch mode - stretch to page or stretch to screen
        stretchModeLabel: 'mega_menu_container_layout_stretch_container_title',
        stretchModeValue_full_screen:
          'mega_menu_container_layout_stretch_container_full_width_radio_button1',
        stretchModeValue_page_width:
          'mega_menu_container_layout_stretch_container_page_radio_button2',

        horizontalMarginInfo: undefined,
      },
      spacing_label: 'mega_menu_container_layout_spacing_slider',
      spacing_tooltip: 'mega_menu_container_layout_spacing_slider_tooltip',
      alignment_label: 'mega_menu_layout_alignment_label',
      alignment_tooltip: 'mega_menu_layout_alignment_label_tooltip',
    },
  },
  gfpp: {
    manageMenu: 'gfpp_mainaction_stylable_horizontal_menu',
    navigate: 'gfpp_secondaryaction_stylable_horizontal_menu',
    settingsDisabledTooltip:
      'gfpp_tooltip_advanced_menu_settings_disabled_multilingual',
  },
};

export const ComponentMetaData = {
  displayName: 'StylableHorizontalMenu',
  componentType: ViewerType,
  nickName: 'horizontalMenu',
  skinName: 'wixui.skins.StylableHorizontalMenu',
  corvidName: 'HorizontalMenu',
};

export const experiments = {
  ADVANCED_MENU_ENABLED: 'se_advancedMenu',
};

export enum ModalResolveType {
  MAIN_ACTION = 'mainActionClicked',
  SECONDARY_ACTION = 'secActionClicked',
  CLOSE_ACTION = 'closeActionClicked',
}

export const SETTINGS_PANEL_NAME = 'wixui.StylableHorizontalMenu.settingsPanel';
export const CONFIRMATION_PANEL_NAME =
  'platformPanels.platformConfirmationPanel';

export const HelpIds = {
  MAIN: 'ac4ace90-6edf-40c3-91d2-707d554e9e07',
  ADVANCED: '85f7ee64-481e-4394-bf00-ea5ed1bfe47c',
  BLOCKS_EDITOR: 'responsive-blocks-packages.menus_help_article',
};

export const CSSVars = {
  containerMarginTop: 'containerMarginTop',
  horizontalSpacing: 'horizontalSpacing',
};

export const items: Array<MenuItemProps> = [
  {
    label: 'with sub items',
    link: {},
    items: [
      {
        label: 'sub-item 1',
        link: {
          href: './s1',
          target: '_self',
        },
        items: [],
      },
      {
        label: 'sub-item 2',
        link: {
          href: './s2',
          target: '_self',
        },
        items: [],
      },
      {
        label: 'sub-item with super long name',
        link: {
          href: './s2',
          target: '_self',
        },
        items: [],
      },
    ],
  },
  {
    label: 'big long name menu item bla bla bla',
    link: {
      href: './long-name',
      target: '_self',
    },
    items: [
      {
        label: 'one',
        link: {
          href: './one',
          target: '_self',
        },
        items: [
          {
            label: 'one',
            link: {
              href: './one',
              target: '_self',
            },
          },
        ],
      },
    ],
  },
  {
    label: 'About',
    link: {
      href: './about',
      target: '_self',
    },
  },
  {
    label: 'Anchor Link',
    link: {
      href: './',
      target: '_self',
      anchorCompId: 'comp-khvv4rln',
    },
  },
  {
    label: 'Contacts',
    link: {
      href: 'http://contacts.com',
      target: '_self',
      rel: 'nofollow',
    },
  },
  {
    label: 'Item with super long name, happy new year',
    link: {
      href: './some',
      target: '_self',
    },
  },
  {
    label: 'Anchor Link 2',
    link: {
      href: './',
      target: '_self',
      anchorCompId: 'comp-khvv4rln',
    },
  },
  {
    label: 'with sub-sub items',
    link: {},
    items: [
      {
        label: 'sub-item 1',
        link: {
          href: './s1',
          target: '_self',
        },
        items: [
          {
            label: 'sub-sub-item 1',
            link: {
              href: './s11',
              target: '_self',
            },
          },
          {
            label: 'sub-sub-item 2 with super long name',
            link: {
              href: './s12',
              target: '_self',
            },
          },
        ],
      },
      {
        label: 'sub-item 2',
        link: {
          href: './s2',
          target: '_self',
        },
        items: [
          {
            label: 'sub-sub-item 1',
            link: {
              href: './s21',
              target: '_self',
            },
          },
          {
            label: 'sub-sub-item 2',
            link: {
              href: './s22',
              target: '_self',
            },
          },
        ],
      },
      {
        label: 'sub-item with super long name',
        link: {
          href: './s2',
          target: '_self',
        },
        items: [],
      },
    ],
  },
  {
    label: 'HOME',
    link: {
      href: '/home',
      target: '_self',
    },
    items: [
      {
        label: 'one item',
        link: {
          href: './one',
          target: '_self',
        },
      },
    ],
  },
];
