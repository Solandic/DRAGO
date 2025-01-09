import * as React from 'react';
import type {
  IMenuWrapperProps,
  IStylableHorizontalMenuImperativeActions,
} from '../../../StylableHorizontalMenu.types';
import { classes } from '../../StylableHorizontalMenu.component.st.css';

const _MenuWrapperWrappable: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IMenuWrapperProps
> = (
  {
    className,
    children,
    ref: _ref,
    items: _items,
    currentItem: _currentItem,
    screenReaderHintElement,
    ...restA11yProps
  },
  ref,
) => {
  const menuContainerRef = React.useRef<HTMLElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      menuContainerRef.current?.focus();
    },
    blur: () => {
      menuContainerRef.current?.blur();
    },
  }));

  return (
    <nav
      tabIndex={-1}
      className={className}
      ref={menuContainerRef}
      {...restA11yProps}
    >
      {screenReaderHintElement}
      <ul className={classes.menu}>{children}</ul>
    </nav>
  );
};

export const MenuWrapperWrappable = React.forwardRef(_MenuWrapperWrappable);
