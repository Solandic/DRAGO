import { getStyleId, createCssVarsObject } from '../../../utils/stylableUtils';
import type { InjectCssVars } from './types';

export const createInjectCssVars_flyout =
  (stylableClassName: string): InjectCssVars =>
  depth => {
    if (depth !== 0) {
      return {};
    }

    const styleId = getStyleId(stylableClassName);
    return {
      animationBox: createCssVarsObject(styleId, 'flyoutAlignment'),
    };
  };
