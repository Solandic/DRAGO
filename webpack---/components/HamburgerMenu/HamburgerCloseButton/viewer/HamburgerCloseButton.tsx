'use-client';
import type { RefObject } from 'react';
import React, { useEffect, useState } from 'react';
import type {
  IStylableButtonImperativeActions,
  IStylableButtonProps,
} from '../../../StylableButton/StylableButton.types';
import StylableButton from '../../../StylableButton/viewer/StylableButton';
import { useHamburgerMenuContext } from '../../HamburgerMenuContext';
import semanticClassNames from '../HamburgerCloseButton.semanticClassNames';
import { classes as stylableButtonClasses } from '../../../StylableButton/viewer/StylableButton.component.st.css';
import { classes, st } from './HamburgerCloseButton.component.st.css';

const getMenuTransitionChildren = (
  menuContainerRef: RefObject<HTMLDivElement> | undefined,
) => {
  if (menuContainerRef?.current) {
    const children = Array.from(
      menuContainerRef?.current?.querySelectorAll('*'),
    );

    return children.filter(child => {
      const { transitionProperty, transitionDuration, transitionDelay } =
        window.getComputedStyle(child);

      return (
        (transitionProperty === 'all' || transitionProperty === 'visibility') &&
        (transitionDelay !== '0s' || transitionDuration !== '0s')
      );
    }) as Array<HTMLElement>;
  }

  return [];
};

const HamburgerCloseButton: React.ForwardRefRenderFunction<
  IStylableButtonImperativeActions,
  IStylableButtonProps
> = ({ id, a11y = {}, className, onClick, ...props }, ref) => {
  const { isMenuOpen, setIsMenuOpen, menuContainerRef } =
    useHamburgerMenuContext();

  const [menuTransitionChildren, setMenuTransitionChildren] = useState<
    Array<HTMLElement>
  >([]);

  useEffect(() => {
    if (!isMenuOpen) {
      menuTransitionChildren.forEach(child => {
        child.style.display = '';
      });
    }
  }, [isMenuOpen, menuTransitionChildren]);

  const onButtonClick = (event: React.MouseEvent) => {
    const children = getMenuTransitionChildren(menuContainerRef);
    setMenuTransitionChildren(children);

    children.forEach(child => {
      child.style.display = 'none';
    });

    setIsMenuOpen(false);
    onClick?.(event);
  };

  return (
    <StylableButton
      {...props}
      id={id}
      className={st(stylableButtonClasses.root, classes.root, className)}
      ref={ref}
      a11y={a11y}
      onClick={onButtonClick}
      semanticClassNames={semanticClassNames}
    />
  );
};

export default React.forwardRef(HamburgerCloseButton);
