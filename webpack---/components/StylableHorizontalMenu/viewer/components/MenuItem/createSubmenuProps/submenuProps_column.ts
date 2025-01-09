import { useMemo } from 'react';
import type { ICreateSubmenuProps } from '../../../../StylableHorizontalMenu.types';
import { getClasses_column } from '../styles/getClasses_column';
import { createInjectCssVars_column } from '../styles/injectCssVars_column';
import { createDepth0PositionUpdaters_column } from '../positionUpdaters/itemDepth0_column';

export const createSubmenuProps_column: ICreateSubmenuProps = (
  stylableClassName,
  menuMode,
) => ({
  column: {
    positionUpdaters: [createDepth0PositionUpdaters_column(menuMode)],
    getClasses: getClasses_column,
    injectCssVars: createInjectCssVars_column(stylableClassName),
  },
});

export const useCreateSubmenuProps_column: ICreateSubmenuProps = (
  stylableClassName,
  menuMode,
) =>
  useMemo(
    () => createSubmenuProps_column(stylableClassName, menuMode),
    [stylableClassName, menuMode],
  );
