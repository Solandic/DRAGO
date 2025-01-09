import { commonItemSkinParamsUDP } from './itemSkinParams';
import type { SkinDefinition } from '@wix/editor-elements-panel/src/adapters/types';
import { addPrefix, prefixes } from './common';

export const commonSubItemSkinParamsUDP: SkinDefinition = addPrefix(
  commonItemSkinParamsUDP,
  prefixes.sub,
);
