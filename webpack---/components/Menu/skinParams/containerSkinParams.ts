import { cssPropertyToDefaultValueMap } from '@wix/editor-elements-panel';
import type { SkinDefinition } from '@wix/editor-elements-panel/src/adapters/types';
import { regular } from './common';

export const commonContainerSkinParamsUDP: SkinDefinition = {
  'container-background': {
    type: 'BACKGROUND_FILL',
    defaultValue: cssPropertyToDefaultValueMap.background,
    state: regular,
  },
  'container-box-shadow': {
    type: 'BOX_SHADOW',
    defaultValue: cssPropertyToDefaultValueMap['box-shadow'],
    state: regular,
  },
  'container-border-left': {
    type: 'BORDER_SIDE',
    defaultValue: cssPropertyToDefaultValueMap['border-left'],
    state: regular,
  },
  'container-border-right': {
    type: 'BORDER_SIDE',
    defaultValue: cssPropertyToDefaultValueMap['border-right'],
    state: regular,
  },
  'container-border-top': {
    type: 'BORDER_SIDE',
    defaultValue: cssPropertyToDefaultValueMap['border-top'],
    state: regular,
  },
  'container-border-bottom': {
    type: 'BORDER_SIDE',
    defaultValue: cssPropertyToDefaultValueMap['border-bottom'],
    state: regular,
  },
  'container-border-radius': {
    type: 'SIDES',
    defaultValue: cssPropertyToDefaultValueMap['border-radius'],
    state: regular,
  },
};

export const ownContainerSkinParams: SkinDefinition = {
  'container-padding-top': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-top'],
    state: regular,
  },
  'container-padding-right': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-right'],
    state: regular,
  },
  'container-padding-bottom': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-bottom'],
    state: regular,
  },
  'container-padding-left': {
    type: 'SIZE',
    defaultValue: cssPropertyToDefaultValueMap['padding-left'],
    state: regular,
  },
};

export const containerSkinParams: SkinDefinition = {
  ...commonContainerSkinParamsUDP,
  ...ownContainerSkinParams,
};
