'use-client';
import * as React from 'react';
import {
  formatClassNames,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import ResponsiveContainer from '@wix/thunderbolt-elements/components/ResponsiveContainer';
import classNames from 'clsx';
import { HamburgerMenuContextProvider } from '../../HamburgerMenuContext';
import type { IHamburgerMenuRootProps } from '../HamburgerMenuRoot.props';
import classes from './style/HamburgerMenuRoot.scss';
import { useAnimationState } from '../../../Menu/viewer/components/MenuItem/useAnimationState';
import {
  INITIAL_HAMBURGER_MENU_ANIMATION_STATE,
  HAMBURGER_MENU_ANIMATION_CONFIG,
  ANIMATION_PACKAGE_CONFIG,
} from '../../../Menu/viewer/constants';
import { getAnimationPackage } from '../../../Menu/viewer/utils/animationUtils';

const HamburgerMenuRoot: React.FC<IHamburgerMenuRootProps> = props => {
  const {
    id,
    customClassNames = [],
    children,
    compPreviewState,
    containerProps,
    containerRootClassName,
    hasResponsiveLayout,
    shouldFocus,
    isMenuOpen,
    updateComponentPropsInViewer,
  } = props;

  const { animationState, initEnterAnimation, initExitAnimation } =
    useAnimationState(
      HAMBURGER_MENU_ANIMATION_CONFIG,
      INITIAL_HAMBURGER_MENU_ANIMATION_STATE,
    );

  const { shouldOmitWrapperLayers } = containerProps ?? {};

  const childrenToRender =
    typeof children === 'function' ? children : () => children;

  const setIsMenuOpen = React.useCallback(
    (isOpen: boolean) => {
      if (isMenuOpen === isOpen) {
        return;
      }

      const getHamburgerMenuAnimationName = () => {
        const animationPackage = getAnimationPackage(id);
        const hamburgerMenuAnimationName =
          ANIMATION_PACKAGE_CONFIG[animationPackage].hamburgerMenuAnimationName;

        return hamburgerMenuAnimationName;
      };

      const hamburgerMenuAnimationName = getHamburgerMenuAnimationName();
      if (isOpen) {
        updateComponentPropsInViewer({ isMenuOpen: true });
        initEnterAnimation(hamburgerMenuAnimationName);
      } else {
        initExitAnimation(hamburgerMenuAnimationName, () =>
          updateComponentPropsInViewer({ isMenuOpen: false }),
        );
      }
    },
    [
      isMenuOpen,
      updateComponentPropsInViewer,
      id,
      initEnterAnimation,
      initExitAnimation,
    ],
  );

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNames(
        // Semantic classes are applied in HamburgerOpenButton
        formatClassNames(null, ...customClassNames),
        containerRootClassName,
        shouldOmitWrapperLayers && classes.root,
      )}
    >
      <HamburgerMenuContextProvider
        compPreviewState={compPreviewState}
        shouldFocus={shouldFocus}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        animationState={animationState}
      >
        {hasResponsiveLayout ? (
          <ResponsiveContainer
            {...containerProps!}
            extraRootClass={classes.root}
          >
            {childrenToRender}
          </ResponsiveContainer>
        ) : (
          childrenToRender()
        )}
      </HamburgerMenuContextProvider>
    </div>
  );
};

export default HamburgerMenuRoot;
