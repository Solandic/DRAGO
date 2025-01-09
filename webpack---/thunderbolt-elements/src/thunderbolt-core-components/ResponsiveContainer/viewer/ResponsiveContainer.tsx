import type { ReactElement } from 'react';
import React, { useCallback } from 'react';
import { getAriaAttributes } from '@wix/editor-elements-common-utils/src/commons/a11y';
import classNames from 'clsx';
import type { IResponsiveContainerProps } from '../ResponsiveContainer.types';
import { TestIds } from '../constants';
import style from './style/ResponsiveContainer.scss';

const OverflowWrapper = React.forwardRef<
  HTMLDivElement,
  {
    className: string;
    children?: React.ReactElement;
  }
>(({ children, className }, ref) => {
  return (
    <div
      className={classNames(className, style['container-overflow'])}
      data-testid={TestIds.overflow}
      ref={ref}
    >
      {children}
    </div>
  );
});

const ResponsiveContainer: React.ForwardRefRenderFunction<
  HTMLDivElement,
  IResponsiveContainerProps
> = (
  {
    containerLayoutClassName,
    overlowWrapperClassName,
    hasOverflow,
    hasScrollOverflow,
    shouldOmitWrapperLayers,
    children,
    role,
    label,
    extraRootClass = '',
    ariaLive,
    ariaAttributes,
    tabIndex: tabIndexFromProps,
    tagName = 'div',
  },
  ref,
) => {
  const hasOverflowWrapper = !shouldOmitWrapperLayers && hasOverflow;
  const tabIndexWithOverflow = hasScrollOverflow ? tabIndexFromProps || 0 : -1;

  const tabIndex = hasOverflowWrapper ? tabIndexWithOverflow : undefined;

  const wrapWithOverflowWrapperIfNeeded = useCallback(
    (reactChildren: ReactElement) =>
      hasOverflowWrapper ? (
        <OverflowWrapper
          className={classNames(overlowWrapperClassName, extraRootClass)}
        >
          {reactChildren}
        </OverflowWrapper>
      ) : (
        reactChildren
      ),
    [hasOverflowWrapper, overlowWrapperClassName, extraRootClass],
  );

  const classes = hasOverflow
    ? containerLayoutClassName
    : classNames(containerLayoutClassName, extraRootClass);

  const childProps: Record<string, any> = {
    ref,
    'data-testid': TestIds.content,
    tabIndex,
    ...(role ? { role } : {}),
    ...(label ? { 'aria-label': label } : {}),
    ...(ariaLive ? { 'aria-live': ariaLive } : {}),
    ...getAriaAttributes(ariaAttributes),
  };

  if (tagName === 'multi-column-layouter') {
    childProps.class = classes;
    childProps.style = { visibility: 'hidden' };
  } else {
    childProps.className = classes;
  }

  return wrapWithOverflowWrapperIfNeeded(
    shouldOmitWrapperLayers ? (
      <React.Fragment>{children()}</React.Fragment>
    ) : (
      React.createElement(tagName || 'div', childProps, children())
    ),
  );
};

export default React.forwardRef(ResponsiveContainer);
