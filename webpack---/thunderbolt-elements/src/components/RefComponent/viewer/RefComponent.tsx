'use-client';
import * as React from 'react';
import classnames from 'clsx';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import type { IRefComponentProps } from '../RefComponent.types';
import style from './styles/ResponsiveContainerRefSkin.scss';

const RefComponent: React.FC<IRefComponentProps> = props => {
  const {
    id,
    className,
    children,
    skin,
    containerRootClassName,
    tagName = 'div' as keyof JSX.IntrinsicElements,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isBuilderComponent,
    ...restProps
  } = props;
  const classNames = classnames(className, style[skin], containerRootClassName);
  const TagName = tagName || ('div' as keyof JSX.IntrinsicElements);

  return (
    <TagName
      id={id}
      className={classNames}
      {...restProps}
      {...getDataAttributes(props)}
    >
      {children({ scopeId: id, parentType: 'RefComponent' })}
    </TagName>
  );
};

export default RefComponent;
