'use-client';
import React from 'react';
import StylableHorizontalMenu from '../../StylableHorizontalMenu';
import type {
  IStylableHorizontalMenuUITypeProps,
  IStylableHorizontalMenuImperativeActions,
} from '../../../StylableHorizontalMenu.types';
import { MenuWrapperScrollable } from '../../components/MenuWrapperScrollable/MenuWrapperScrollable';
import { useCreateSubmenuProps_flyoutAndColumn } from '../../components/MenuItem/createSubmenuProps/submenuProps_flyoutAndColumn';

const StylableHorizontalMenu_ScrollFlyoutAndColumn: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IStylableHorizontalMenuUITypeProps
> = (props, ref) => (
  <StylableHorizontalMenu
    {...props}
    ref={ref}
    menuWrapper={MenuWrapperScrollable}
    submenuProps={useCreateSubmenuProps_flyoutAndColumn(
      props.stylableClassName,
      props.menuMode,
    )}
  />
);

export default React.forwardRef(StylableHorizontalMenu_ScrollFlyoutAndColumn);
