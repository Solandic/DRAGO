import {
  HOVER_STATE,
  REGULAR_STATE,
  SELECTED_STATE,
} from '@wix/editor-elements-panel';
import type { SkinDefinition } from '@wix/editor-elements-panel/src/adapters/types';

export const regular = REGULAR_STATE.id;
export const hover = HOVER_STATE.id;
export const selected = SELECTED_STATE.id;

// Replace with 'none' once supported by UDP
// Currently makes value in BackgroundDesign.tsx to be undefined
export const backgroundDefaultValue = '#ffffff';

// Replace with 'revert' once supported by UDP
// Currently makes font in TextDesign.tsx to be undefined
export const fontDefaultValue = 'font_6';

export const addPrefix = (definition: SkinDefinition, prefix: string) =>
  Object.entries(definition).reduce((prev, [key, value]) => {
    return { ...prev, [`${prefix}-${key}`]: value };
  }, {});

export const prefixes = {
  sub: 'sub',
  dropdown: 'dropdown',
  dropdownMenu: 'dropdown-menu',
};
