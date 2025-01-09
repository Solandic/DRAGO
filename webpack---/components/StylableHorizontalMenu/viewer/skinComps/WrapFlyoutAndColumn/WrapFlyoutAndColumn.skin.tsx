'use-client';
import React from 'react';
import StylableHorizontalMenu from '../../StylableHorizontalMenu';
import type {
  IStylableHorizontalMenuUITypeProps,
  IStylableHorizontalMenuImperativeActions,
} from '../../../StylableHorizontalMenu.types';
import { MenuWrapperWrappable } from '../../components/MenuWrapperWrappable/MenuWrapperWrappable';
import { useCreateSubmenuProps_flyoutAndColumn } from '../../components/MenuItem/createSubmenuProps/submenuProps_flyoutAndColumn';

const StylableHorizontalMenu_WrapFlyoutAndColumn: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IStylableHorizontalMenuUITypeProps
> = (props, ref) => (
  <StylableHorizontalMenu
    {...props}
    ref={ref}
    menuWrapper={MenuWrapperWrappable}
    submenuProps={useCreateSubmenuProps_flyoutAndColumn(
      props.stylableClassName,
      props.menuMode,
    )}
  />
);

export default React.forwardRef(StylableHorizontalMenu_WrapFlyoutAndColumn);
