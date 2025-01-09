'use-client';
import React, { useEffect, useImperativeHandle } from 'react';
import type { IStylableButtonImperativeActions } from '../../../StylableButton/StylableButton.types';
import StylableButton from '../../../StylableButton/viewer/StylableButton';
import { useHamburgerMenuContext } from '../../HamburgerMenuContext';
import { classes as stylableButtonClasses } from '../../../StylableButton/viewer/StylableButton.component.st.css';
/**
 * Importing semantic classes from HamburgerMenuRoot component because
 * that is the component that gets selected in the editor and
 * it is used to show available CSS classes in Studio editor
 */
import semanticClassNames from '../../HamburgerMenuRoot/HamburgerMenuRoot.semanticClassNames';
import type { IHamburgerOpenButtonProps } from '../HamburgerOpenButton.types';
import { classes, st } from './HamburgerOpenButton.component.st.css';

const HamburgerOpenButton: React.ForwardRefRenderFunction<
  IStylableButtonImperativeActions,
  IHamburgerOpenButtonProps
> = ({ id, a11y = {}, className, ariaLabel, onClick, ...props }, ref) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { isMenuOpen, shouldFocus, setIsMenuOpen } = useHamburgerMenuContext();

  useImperativeHandle(ref, () => ({
    focus: () => buttonRef.current?.focus(),
    blur: () => buttonRef.current?.blur(),
  }));

  useEffect(() => {
    if (shouldFocus && isMenuOpen === false) {
      buttonRef.current?.focus();
    }
  }, [shouldFocus, isMenuOpen]);

  const onButtonClick = (event: React.MouseEvent) => {
    setIsMenuOpen(!isMenuOpen);
    onClick?.(event);
  };

  return (
    <nav aria-label={ariaLabel} className={classes.nav}>
      <StylableButton
        {...props}
        className={st(stylableButtonClasses.root, classes.root, className)}
        a11y={{
          ...a11y,
          expanded: isMenuOpen || false,
          haspopup: 'true',
        }}
        id={id}
        onClick={onButtonClick}
        ref={buttonRef}
        semanticClassNames={semanticClassNames}
      />
    </nav>
  );
};

export default React.forwardRef(HamburgerOpenButton);
