'use-client';
import * as React from 'react';
import {
  formatClassNames,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import MeshContainer from '@wix/thunderbolt-elements/components/MeshContainer';
import ResponsiveContainer from '@wix/thunderbolt-elements/components/ResponsiveContainer';
import semanticClassNames from '../HamburgerMenuContainer.semanticClassNames';
import type { IHamburgerMenuContainerProps } from '../HamburgerMenuContainer.props';
import { useHamburgerMenuContext } from '../../HamburgerMenuContext';
import { st, classes } from './HamburgerMenuContainer.component.st.css';
import animationClasses from './HamburgerMenuContainerAnimation.scss';

const HamburgerMenuContainer: React.FC<
  IHamburgerMenuContainerProps
> = props => {
  const {
    id,
    className,
    customClassNames = [],
    children,
    hasResponsiveLayout,
    containerProps,
    meshProps,
    containerRootClassName,
    stylableClassName,
    onOpen,
    onClose,
    onClick,
    onMouseEnter,
    onMouseLeave,
  } = props;
  const {
    isMenuOpen,
    menuContainerRef,
    isMenuContainerFullscreen = false,
    animationState,
  } = useHamburgerMenuContext();

  const childrenToRender =
    typeof children === 'function' ? children : () => children;
  React.useEffect(() => {
    if (isMenuOpen === undefined) {
      return;
    }

    isMenuOpen ? onOpen?.({ type: 'onOpen' }) : onClose?.({ type: 'onClose' });
  }, [isMenuOpen, onOpen, onClose]);

  const onMenuContainerClick = React.useCallback(
    (event: React.MouseEvent) => {
      onClick?.(event);
    },
    [onClick],
  );

  return (
    <div
      id={id}
      ref={menuContainerRef}
      tabIndex={-1}
      className={st(containerRootClassName, className, animationClasses.root)}
      onClick={onMenuContainerClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-animation-name={animationState.name}
      data-animation-state={animationState.phase}
      {...getDataAttributes(props)}
    >
      <div
        aria-hidden
        className={st(
          classes.root,
          {},
          isMenuContainerFullscreen ? undefined : stylableClassName,
          formatClassNames(semanticClassNames.root, ...customClassNames),
        )}
      />
      {hasResponsiveLayout ? (
        <ResponsiveContainer {...containerProps}>
          {childrenToRender}
        </ResponsiveContainer>
      ) : (
        <MeshContainer {...meshProps} id={id}>
          {childrenToRender}
        </MeshContainer>
      )}
    </div>
  );
};

export default HamburgerMenuContainer;
