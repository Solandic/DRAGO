import { useMemo } from 'react';
import type { ICreateSubmenuProps } from '../../../../StylableHorizontalMenu.types';
import { createSubmenuProps_flyout } from './submenuProps_flyout';
import { createSubmenuProps_column } from './submenuProps_column';

export const createSubmenuProps_flyoutAndColumn: ICreateSubmenuProps = (
  stylableClassName,
  menuMode,
) => ({
  ...createSubmenuProps_column(stylableClassName, menuMode),
  ...createSubmenuProps_flyout(stylableClassName, menuMode),
});

export const useCreateSubmenuProps_flyoutAndColumn: ICreateSubmenuProps = (
  stylableClassName,
  menuMode,
) =>
  useMemo(
    () => createSubmenuProps_flyoutAndColumn(stylableClassName, menuMode),
    [stylableClassName, menuMode],
  );
