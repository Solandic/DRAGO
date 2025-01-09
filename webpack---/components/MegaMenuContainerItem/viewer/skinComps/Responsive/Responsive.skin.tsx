'use-client';
import * as React from 'react';
import cn from 'clsx';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import ResponsiveContainer from '@wix/thunderbolt-elements/components/ResponsiveContainer';
import type { IMegaMenuContainerItemPropsResponsive } from '../../../MegaMenuContainerItem.types';
import { useParentStyles } from '../../useParentStyles';
import { useMegaMenuContext } from '../../MegaMenuContext';

const MegaMenuContainerItem: React.FC<
  IMegaMenuContainerItemPropsResponsive
> = props => {
  const {
    id,
    children,
    containerRootClassName,
    parentType,
    parentStylableClassName,
  } = props;
  const childrenToRender =
    typeof children === 'function' ? children : () => children;
  const { className, cssVars } = useParentStyles(
    parentType,
    parentStylableClassName,
  );

  const { isOpen, setIsOpen, labelRef } = useMegaMenuContext();

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = event => {
    if (isOpen && event.relatedTarget !== labelRef?.current) {
      setIsOpen(false);
    }
  };

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={cn(containerRootClassName, className)}
      style={cssVars}
      onMouseLeave={handleMouseLeave}
    >
      <ResponsiveContainer {...props.containerProps}>
        {childrenToRender}
      </ResponsiveContainer>
    </div>
  );
};

export default MegaMenuContainerItem;
