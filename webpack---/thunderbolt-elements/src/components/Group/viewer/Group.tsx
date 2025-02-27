'use-client';
import React from 'react';
import classNames from 'clsx';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import type { IGroupProps } from '../Group.types';
import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import styles from './styles/Group.scss';

const Group: React.FC<IGroupProps> = props => {
  const {
    id,
    className,
    meshProps,
    children,
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
  } = props;

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={classNames(className, styles.root)}
    >
      <MeshContainer id={id} {...meshProps}>
        {children}
      </MeshContainer>
    </div>
  );
};

export default Group;
