'use-client';
import React from 'react';
import StylableHorizontalMenu from '../../StylableHorizontalMenu';
import type {
  IStylableHorizontalMenuUITypeProps,
  IStylableHorizontalMenuImperativeActions,
} from '../../../StylableHorizontalMenu.types';
import { MenuWrapperWrappable } from '../../components/MenuWrapperWrappable/MenuWrapperWrappable';
import { useCreateSubmenuProps_flyout } from '../../components/MenuItem/createSubmenuProps/submenuProps_flyout';

const StylableHorizontalMenu_WrapFlyout: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IStylableHorizontalMenuUITypeProps
> = (props, ref) => (
  <StylableHorizontalMenu
    {...props}
    ref={ref}
    menuWrapper={MenuWrapperWrappable}
    submenuProps={useCreateSubmenuProps_flyout(
      props.stylableClassName,
      props.menuMode,
    )}
  />
);

export default React.forwardRef(StylableHorizontalMenu_WrapFlyout);
