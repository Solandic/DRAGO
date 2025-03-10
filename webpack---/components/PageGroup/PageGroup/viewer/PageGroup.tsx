'use-client';
import * as React from 'react';
import type { ReactNode } from 'react';
import classNames from 'clsx';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import type { IPageGroupProps } from '../PageGroup.types';
import GroupContent from '../../commons/viewer/GroupContent';
import { TRANSITION_GROUP_ID } from '../../commons/constants';
import style from './style/style.scss';

const GroupContentMemo = React.memo(GroupContent, (__, nextProps) => {
  return !(nextProps.children()! as Array<ReactNode>).length;
});

const PageGroup: React.FC<IPageGroupProps> = props => {
  const { id, children, className, ...restProps } = props;

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNames(style.pageGroupWrapper, className)}
    >
      <GroupContentMemo
        id={`${id}_${TRANSITION_GROUP_ID}`}
        className={style.pageGroup}
        {...restProps}
      >
        {children}
      </GroupContentMemo>
    </div>
  );
};

export default PageGroup;
