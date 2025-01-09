'use-client';
import * as React from 'react';
import {
  formatClassNames,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import ResponsiveContainer from '@wix/thunderbolt-elements/components/ResponsiveContainer';
import type { IMegaMenuContainerDropdownProps } from '../../../MegaMenuContainerItem.types';
import { DropdownWrapper } from '../../../../Menu/viewer/components/DropdownWrapper/DropdownWrapper';
import styles from './Dropdown.scss';
import cn from 'clsx';
import { semanticClassNames as megaMenuContainerItemSemanticClassNames } from '../../../MegaMenuContainerItem.semanticClassNames';
import menuItemStyles from '../../../../Menu/viewer/components/MenuItem/style/MenuItem.scss';

const MegaMenuContainerItem: React.FC<
  IMegaMenuContainerDropdownProps
> = props => {
  const {
    id,
    children,
    containerRootClassName,
    menuOrientation,
    customClassNames = [],
  } = props;
  const childrenToRender =
    typeof children === 'function' ? children : () => children;

  const dropdownContainerClassNames = cn(
    styles.root,
    containerRootClassName,
    menuItemStyles.dropdownContainer,
    formatClassNames(
      megaMenuContainerItemSemanticClassNames.dropdownContainer,
      ...customClassNames,
    ),
  );

  return (
    <DropdownWrapper
      id={id}
      dataAttributes={getDataAttributes(props)}
      className={dropdownContainerClassNames}
      menuOrientation={menuOrientation}
    >
      <ResponsiveContainer {...props.containerProps}>
        {childrenToRender}
      </ResponsiveContainer>
    </DropdownWrapper>
  );
};

export default MegaMenuContainerItem;
