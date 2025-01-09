'use-client';
import React from 'react';
import StylableHorizontalMenu from '../../StylableHorizontalMenu';
import type {
  IStylableHorizontalMenuUITypeProps,
  IStylableHorizontalMenuImperativeActions,
} from '../../../StylableHorizontalMenu.types';
import { MenuWrapperScrollable } from '../../components/MenuWrapperScrollable/MenuWrapperScrollable';
import { useCreateSubmenuProps_column } from '../../components/MenuItem/createSubmenuProps/submenuProps_column';

const StylableHorizontalMenu_ScrollColumn: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IStylableHorizontalMenuUITypeProps
> = (props, ref) => (
  <StylableHorizontalMenu
    {...props}
    ref={ref}
    menuWrapper={MenuWrapperScrollable}
    submenuProps={useCreateSubmenuProps_column(
      props.stylableClassName,
      props.menuMode,
    )}
  />
);

export default React.forwardRef(StylableHorizontalMenu_ScrollColumn);
