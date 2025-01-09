'use-client';
import React from 'react';
import StylableHorizontalMenu from '../../StylableHorizontalMenu';
import type {
  IStylableHorizontalMenuUITypeProps,
  IStylableHorizontalMenuImperativeActions,
} from '../../../StylableHorizontalMenu.types';
import { MenuWrapperWrappable } from '../../components/MenuWrapperWrappable/MenuWrapperWrappable';
import { useCreateSubmenuProps_column } from '../../components/MenuItem/createSubmenuProps/submenuProps_column';

const StylableHorizontalMenu_WrapColumn: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IStylableHorizontalMenuUITypeProps
> = (props, ref) => (
  <StylableHorizontalMenu
    {...props}
    ref={ref}
    menuWrapper={MenuWrapperWrappable}
    submenuProps={useCreateSubmenuProps_column(
      props.stylableClassName,
      props.menuMode,
    )}
  />
);

export default React.forwardRef(StylableHorizontalMenu_WrapColumn);
