import { getStyleId, createCssVarsObject } from '../../../utils/stylableUtils';
import { CSSVars } from '../../../../constants';
import type { InjectCssVars } from './types';

export const createInjectCssVars_column =
  (stylableClassName: string): InjectCssVars =>
  depth => {
    if (depth !== 0) {
      return {};
    }

    const styleId = getStyleId(stylableClassName);
    return {
      list: createCssVarsObject(styleId, CSSVars.horizontalSpacing),
      megaMenuComp: createCssVarsObject(styleId, CSSVars.containerMarginTop),
    };
  };
