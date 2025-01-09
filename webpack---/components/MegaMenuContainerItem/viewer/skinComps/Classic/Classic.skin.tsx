'use-client';
import * as React from 'react';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import Container from '../../../../Container/viewer/skinComps/DefaultAreaSkin/DefaultAreaSkin.skin';
import type { IMegaMenuContainerItemProps } from '../../../MegaMenuContainerItem.types';
import { useParentStyles } from '../../useParentStyles';
import { useMegaMenuContext } from '../../MegaMenuContext';

const MegaMenuContainerItem: React.FC<IMegaMenuContainerItemProps> = props => {
  const { id, children, meshProps, parentType, parentStylableClassName } =
    props;
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
    <Container
      {...getDataAttributes(props)}
      id={id}
      hasPlatformClickHandler={false}
      meshProps={meshProps}
      className={className}
      style={cssVars}
      onMouseLeave={handleMouseLeave}
    >
      {childrenToRender}
    </Container>
  );
};

export default MegaMenuContainerItem;
