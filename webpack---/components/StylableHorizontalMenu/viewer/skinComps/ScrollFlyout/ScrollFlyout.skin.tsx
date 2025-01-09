'use-client';
import React from 'react';
import StylableHorizontalMenu from '../../StylableHorizontalMenu';
import type {
  IStylableHorizontalMenuUITypeProps,
  IStylableHorizontalMenuImperativeActions,
} from '../../../StylableHorizontalMenu.types';
import { MenuWrapperScrollable } from '../../components/MenuWrapperScrollable/MenuWrapperScrollable';
import { useCreateSubmenuProps_flyout } from '../../components/MenuItem/createSubmenuProps/submenuProps_flyout';

const StylableHorizontalMenu_ScrollFlyout: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IStylableHorizontalMenuUITypeProps
> = (props, ref) => (
  <StylableHorizontalMenu
    {...props}
    ref={ref}
    menuWrapper={MenuWrapperScrollable}
    submenuProps={useCreateSubmenuProps_flyout(
      props.stylableClassName,
      props.menuMode,
    )}
  />
);

export default React.forwardRef(StylableHorizontalMenu_ScrollFlyout);
