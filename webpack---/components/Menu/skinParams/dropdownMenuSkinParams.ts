import type { SkinDefinition } from '@wix/editor-elements-panel/src/adapters/types';
import { addPrefix, prefixes, regular, hover, selected } from './common';
import { commonContainerSkinParamsUDP } from './containerSkinParams';
import {
  commonItemSkinParamsUDP,
  commonItemSkinParamsLayoutPanel,
} from './itemSkinParams';
import { commonSubItemSkinParamsUDP } from './subItemSkinParams';
import { cssPropertyToDefaultValueMap } from '@wix/editor-elements-panel';

export const ownDropdownMenuSkinParamsUDP: SkinDefinition = {
  'item-hover-font': {
    type: 'FONT',
    state: hover,
  },
  'item-selected-font': {
    type: 'FONT',
    state: selected,
  },
  'item-hover-text-transform': {
    type: 'TEXT_TRANSFORM',
    state: hover,
  },
  'item-selected-text-transform': {
    type: 'TEXT_TRANSFORM',
    state: selected,
  },
  'item-hover-letter-spacing': {
    type: 'SIZE',
    state: hover,
  },
  'item-selected-letter-spacing': {
    type: 'SIZE',
    state: selected,
  },
  'item-hover-line-height': {
    type: 'SIZE',
    state: hover,
  },
  'item-selected-line-height': {
    type: 'SIZE',
    state: selected,
  },
  'sub-item-hover-font': {
    type: 'FONT',
    state: hover,
  },
  'sub-item-selected-font': {
    type: 'FONT',
    state: selected,
  },
  'sub-item-hover-text-transform': {
    type: 'TEXT_TRANSFORM',
    state: hover,
  },
  'sub-item-selected-text-transform': {
    type: 'TEXT_TRANSFORM',
    state: selected,
  },
  'sub-item-hover-letter-spacing': {
    type: 'SIZE',
    state: hover,
  },
  'sub-item-selected-letter-spacing': {
    type: 'SIZE',
    state: selected,
  },
  'sub-item-hover-line-height': {
    type: 'SIZE',
    state: hover,
  },
  'sub-item-selected-line-height': {
    type: 'SIZE',
    state: selected,
  },
};
export const commonDropdownMenuSkinParamsUDP: SkinDefinition = {
  ...commonContainerSkinParamsUDP,
  ...commonItemSkinParamsUDP,
  ...commonSubItemSkinParamsUDP,
};
export const dropdownMenuSkinParamsUDP: SkinDefinition = {
  ...commonDropdownMenuSkinParamsUDP,
  ...ownDropdownMenuSkinParamsUDP,
};
export const prefixedDropdownMenuSkinParamsUDP: SkinDefinition = addPrefix(
  dropdownMenuSkinParamsUDP,
  prefixes.dropdownMenu,
);

export const ownDropdownMenuSkinParamsLayoutPanel: SkinDefinition = {
  'container-vertical-padding': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-top'],
    state: regular,
  },
  'container-horizontal-padding': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-left'],
    state: regular,
  },
  'item-vertical-spacing': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['row-gap'],
    state: regular,
  },
  'item-horizontal-spacing': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['column-gap'],
    state: regular,
  },
  'sub-items-vertical-spacing-before': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['margin-top'],
    state: regular,
  },
  'sub-items-vertical-spacing-between': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap.gap,
    state: regular,
  },
  'sub-item-vertical-padding': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-top'],
    state: regular,
  },
  'sub-item-horizontal-padding': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-left'],
    state: regular,
  },
  'columns-number': {
    type: 'CSSString',
    state: regular,
    defaultValue: '1',
  },
  align: {
    type: 'TEXT_ALIGN',
    state: regular,
    defaultValue: cssPropertyToDefaultValueMap['text-align'],
  },
  'item-align': {
    type: 'TEXT_ALIGN',
    state: regular,
    defaultValue: cssPropertyToDefaultValueMap['text-align'],
  },
  'sub-item-align': {
    type: 'TEXT_ALIGN',
    state: regular,
    defaultValue: cssPropertyToDefaultValueMap['text-align'],
  },
};

export const commonDropdownMenuSkinParamsLayoutPanel: SkinDefinition =
  commonItemSkinParamsLayoutPanel;
export const dropdownMenuSkinParamsLayoutPanel: SkinDefinition = {
  ...commonDropdownMenuSkinParamsLayoutPanel,
  ...ownDropdownMenuSkinParamsLayoutPanel,
};
export const prefixedDropdownMenuSkinParamsLayoutPanel: SkinDefinition =
  addPrefix(dropdownMenuSkinParamsLayoutPanel, prefixes.dropdownMenu);

export const dropdownMenuSkinParams: SkinDefinition = {
  ...dropdownMenuSkinParamsUDP,
  ...dropdownMenuSkinParamsLayoutPanel,
};
export const prefixedDropdownMenuSkinParams: SkinDefinition = {
  ...prefixedDropdownMenuSkinParamsUDP,
  ...prefixedDropdownMenuSkinParamsLayoutPanel,
};
