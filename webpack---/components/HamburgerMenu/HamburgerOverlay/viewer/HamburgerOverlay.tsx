'use-client';
import type { PropsWithChildren } from 'react';
import React, { createRef, useCallback, useEffect, useMemo } from 'react';
import {
  formatClassNames,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import ResponsiveContainer from '@wix/thunderbolt-elements/components/ResponsiveContainer';
import MeshContainer from '@wix/thunderbolt-elements/components/MeshContainer';
import { createPortal } from 'react-dom';
import semanticClassNames from '../HamburgerOverlay.semanticClassNames';
import { useHamburgerMenuContext } from '../../HamburgerMenuContext';
import type { IHamburgerOverlayProps } from '../HamburgerOverlay.props';
import { dataHooks } from './constants';
import { st, classes } from './HamburgerOverlay.component.st.css';
import { useMasterPage } from '../../../../common/hooks/useMasterPage';
import { MenuParts } from '../../../Menu/viewer/constants';
import animationClasses from './HamburgerOverlayAnimation.scss';
import { useMenuContext } from '../../../Menu/viewer/MenuContext';

const HamburgerOverlay: React.FC<IHamburgerOverlayProps> = props => {
  const {
    id,
    customClassNames = [],
    children,
    hasResponsiveLayout,
    containerProps,
    containerRootClassName,
    meshProps,
    hideFromDOM,
    stylableClassName,
    tapOutsideToClose,
    showBackgroundOverlay,
    onOpenStateChange,
    ariaLabel,
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    isMenuContainerFullscreen,
  } = props;
  const shouldShowStylableBackground =
    (showBackgroundOverlay && hasResponsiveLayout) || isMenuContainerFullscreen;
  const {
    isMenuOpen = false,
    setIsMenuOpen,
    menuContainerRef,
    setIsMenuContainerFullscreen,
    shouldFocus,
    animationState,
  } = useHamburgerMenuContext();

  const { menuStyleId } = useMenuContext();

  const MenuStyleWrapper = useMemo(
    () =>
      menuStyleId
        ? (_props: PropsWithChildren<{}>) => (
            <div id={menuStyleId}>{_props.children}</div>
          )
        : React.Fragment,
    [menuStyleId],
  );

  const StylableBackground = (
    <div
      data-hook={dataHooks.dialog}
      aria-hidden
      className={st(
        classes.overlay,
        {},
        shouldShowStylableBackground ? stylableClassName : undefined,
        showBackgroundOverlay && hasResponsiveLayout
          ? formatClassNames(semanticClassNames.root, ...customClassNames)
          : undefined,
      )}
    />
  );
  const dialogRef = createRef<HTMLDivElement>();

  useEffect(() => {
    onOpenStateChange(isMenuOpen);

    if (isMenuOpen && shouldFocus) {
      dialogRef.current?.focus();
    }
  }, [isMenuOpen, onOpenStateChange, dialogRef, shouldFocus]);

  useEffect(() => {
    return () => {
      onOpenStateChange(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsMenuContainerFullscreen(isMenuContainerFullscreen);
  }, [isMenuContainerFullscreen, setIsMenuContainerFullscreen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen]);

  const masterPage = useMasterPage();

  const onOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      onClick?.(event);
      const target = event.target as Element | null;
      const clickedOnLink = target?.closest('a');
      const clickedOnOverlay = !target?.closest(
        `#${menuContainerRef?.current?.id}`,
      );

      if (clickedOnLink || (tapOutsideToClose && clickedOnOverlay)) {
        closeMenu();
      }
    },
    [closeMenu, menuContainerRef, onClick, tapOutsideToClose],
  );

  const childrenToRender =
    typeof children === 'function' ? children : () => children;

  const renderOverlay = () => {
    if (hideFromDOM && !isMenuOpen) {
      return null;
    }

    return (
      <MenuStyleWrapper>
        <div
          id={id}
          className={st(
            containerRootClassName,
            {
              showBackgroundOverlay,
              isMenuOpen,
              shouldScroll: !hasResponsiveLayout,
            },
            classes.root,
            animationClasses.root,
          )}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          data-visible={isMenuOpen}
          onKeyDown={e => e.key === 'Escape' && closeMenu()}
          onClick={onOverlayClick}
          onDoubleClick={onDblClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          data-hook={dataHooks.root}
          ref={dialogRef}
          tabIndex={-1}
          data-part={MenuParts.HamburgerOverlay}
          data-animation-name={animationState.name}
          data-animation-state={animationState.phase}
          {...getDataAttributes(props)}
        >
          {hasResponsiveLayout ? (
            <>
              {StylableBackground}
              <ResponsiveContainer {...containerProps}>
                {childrenToRender}
              </ResponsiveContainer>
            </>
          ) : (
            <div className={st(classes.scrollContent)}>
              {StylableBackground}
              <MeshContainer id={id} {...meshProps}>
                {childrenToRender}
              </MeshContainer>
            </div>
          )}
        </div>
      </MenuStyleWrapper>
    );
  };
  return masterPage
    ? createPortal(renderOverlay(), masterPage)
    : renderOverlay();
};

export default HamburgerOverlay;
