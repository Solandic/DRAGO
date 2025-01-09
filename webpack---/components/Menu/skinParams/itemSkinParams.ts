import type { SkinDefinition } from '@wix/editor-elements-panel/src/adapters/types';
import { cssPropertyToDefaultValueMap } from '@wix/editor-elements-panel';
import { hover, regular, selected } from './common';

export const commonItemSkinParamsUDP: SkinDefinition = {
  'item-background': {
    type: 'BACKGROUND_FILL',
    defaultValue: cssPropertyToDefaultValueMap.background,
    state: regular,
  },
  'item-hover-background': {
    type: 'BACKGROUND_FILL',
    state: hover,
  },
  'item-selected-background': {
    type: 'BACKGROUND_FILL',
    state: selected,
  },
  'item-font': {
    type: 'FONT',
    defaultValue: cssPropertyToDefaultValueMap.font,
    state: regular,
  },
  'item-color': {
    type: 'CSS_COLOR',
    defaultValue: cssPropertyToDefaultValueMap.color,
    state: regular,
  },
  'item-hover-color': {
    type: 'CSS_COLOR',
    state: hover,
  },
  'item-selected-color': {
    type: 'CSS_COLOR',
    state: selected,
  },
  'item-text-decoration': {
    type: 'TEXT_DECORATION_LINE',
    defaultValue: cssPropertyToDefaultValueMap['text-decoration-line'],
    state: regular,
  },
  'item-hover-text-decoration': {
    type: 'TEXT_DECORATION_LINE',
    state: hover,
  },
  'item-selected-text-decoration': {
    type: 'TEXT_DECORATION_LINE',
    state: selected,
  },
  'item-text-transform': {
    type: 'TEXT_TRANSFORM',
    defaultValue: cssPropertyToDefaultValueMap['text-transform'],
    state: regular,
  },
  'item-text-outline': {
    type: 'TEXT_OUTLINE',
    defaultValue: cssPropertyToDefaultValueMap['text-outline'],
    state: regular,
  },
  'item-hover-text-outline': {
    type: 'TEXT_OUTLINE',
    state: hover,
  },
  'item-selected-text-outline': {
    type: 'TEXT_OUTLINE',
    state: selected,
  },
  'item-text-highlight': {
    type: 'CSS_COLOR',
    defaultValue: cssPropertyToDefaultValueMap['background-color'],
    state: regular,
  },
  'item-hover-text-highlight': {
    type: 'CSS_COLOR',
    state: hover,
  },
  'item-selected-text-highlight': {
    type: 'CSS_COLOR',
    state: selected,
  },
  'item-letter-spacing': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['letter-spacing'],
    state: regular,
  },
  'item-line-height': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['line-height'],
    state: regular,
  },
  'item-text-shadow': {
    type: 'TEXT_SHADOW',
    defaultValue: cssPropertyToDefaultValueMap['text-shadow'],
    state: regular,
  },
  'item-hover-text-shadow': {
    type: 'TEXT_SHADOW',
    state: hover,
  },
  'item-selected-text-shadow': {
    type: 'TEXT_SHADOW',
    state: selected,
  },
  'item-border-left': {
    type: 'BORDER_SIDE',
    defaultValue: cssPropertyToDefaultValueMap['border-left'],
    state: regular,
  },
  'item-hover-border-left': {
    type: 'BORDER_SIDE',
    state: hover,
  },
  'item-selected-border-left': {
    type: 'BORDER_SIDE',
    state: selected,
  },
  'item-border-right': {
    type: 'BORDER_SIDE',
    defaultValue: cssPropertyToDefaultValueMap['border-right'],
    state: regular,
  },
  'item-hover-border-right': {
    type: 'BORDER_SIDE',
    state: hover,
  },
  'item-selected-border-right': {
    type: 'BORDER_SIDE',
    state: selected,
  },
  'item-border-top': {
    type: 'BORDER_SIDE',
    defaultValue: cssPropertyToDefaultValueMap['border-top'],
    state: regular,
  },
  'item-hover-border-top': {
    type: 'BORDER_SIDE',
    state: hover,
  },
  'item-selected-border-top': {
    type: 'BORDER_SIDE',
    state: selected,
  },
  'item-border-bottom': {
    type: 'BORDER_SIDE',
    defaultValue: cssPropertyToDefaultValueMap['border-bottom'],
    state: regular,
  },
  'item-hover-border-bottom': {
    type: 'BORDER_SIDE',
    state: hover,
  },
  'item-selected-border-bottom': {
    type: 'BORDER_SIDE',
    state: selected,
  },
  'item-border-radius': {
    type: 'SIDES',
    defaultValue: cssPropertyToDefaultValueMap['border-radius'],
    state: regular,
  },
  'item-hover-border-radius': {
    type: 'SIDES',
    state: hover,
  },
  'item-selected-border-radius': {
    type: 'SIDES',
    state: selected,
  },
  'item-box-shadow': {
    type: 'BOX_SHADOW',
    defaultValue: cssPropertyToDefaultValueMap['box-shadow'],
    state: regular,
  },
  'item-hover-box-shadow': {
    type: 'BOX_SHADOW',
    state: hover,
  },
  'item-selected-box-shadow': {
    type: 'BOX_SHADOW',
    state: selected,
  },
};

export const ownItemSkinParamsUDP: SkinDefinition = {
  'horizontal-item-icon-display': {
    type: 'CSSString',
    defaultValue: 'initial',
    state: regular,
  },
  'item-icon-size': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap.height,
    state: regular,
  },
  'item-icon-color': {
    type: 'CSS_COLOR',
    defaultValue: cssPropertyToDefaultValueMap.color,
    state: regular,
  },
  'item-hover-icon-color': {
    type: 'CSS_COLOR',
    state: hover,
  },
  'item-divider': {
    type: 'BORDER_SIDE',
    defaultValue: cssPropertyToDefaultValueMap['border-top'],
    state: regular,
  },
  'item-text-align': {
    type: 'TEXT_ALIGNMENT',
    defaultValue: cssPropertyToDefaultValueMap['justify-content'],
    state: regular,
  },
  // eslint-disable-next-line editor-elements/no-direction-in-skin-params
  'item-direction': {
    type: 'DIRECTION',
    defaultValue: cssPropertyToDefaultValueMap.direction,
    state: regular,
  },
};

export const commonItemSkinParamsLayoutPanel: SkinDefinition = {
  'item-vertical-padding': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-top'],
    state: regular,
  },
  'item-horizontal-padding': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-left'],
    state: regular,
  },
};

export const itemSkinParams: SkinDefinition = {
  ...commonItemSkinParamsUDP,
  ...ownItemSkinParamsUDP,
  ...commonItemSkinParamsLayoutPanel,
};
