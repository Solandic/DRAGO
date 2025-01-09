'use-client';
import * as React from 'react';
import type {
  IStylableHorizontalMenuUITypeProps,
  IStylableHorizontalMenuImperativeActions,
} from '../../../StylableHorizontalMenu.types';
import WrapFlyoutAndColumn from '../WrapFlyoutAndColumn/WrapFlyoutAndColumn.skin';
import ScrollFlyoutAndColumn from '../ScrollFlyoutAndColumn/ScrollFlyoutAndColumn.skin';

const StylableHorizontalMenu_Default: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IStylableHorizontalMenuUITypeProps
> = (props, ref) => {
  const SkinComponent =
    props.menuMode === 'wrap' ? WrapFlyoutAndColumn : ScrollFlyoutAndColumn;

  return <SkinComponent ref={ref} {...props} />;
};

export default React.forwardRef(StylableHorizontalMenu_Default);
