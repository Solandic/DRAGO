import React from 'react';
import { classes as rootClasses } from '../../StylableHorizontalMenu.component.st.css';
import type { ScrollButtonProps } from '../../../StylableHorizontalMenu.types';
import { st, classes } from './ScrollButton.st.css';

const ScrollButton: React.FC<ScrollButtonProps> = props => {
  const {
    className: propClassName,
    onClick,
    side,
    isHidden,
    dataTestId,
  } = props;

  const className = st(
    classes.root,
    { side, isVisible: !isHidden },
    rootClasses.scrollButton,
    propClassName,
  );

  return (
    <div
      onClick={onClick}
      aria-hidden="true"
      aria-label="scroll"
      className={className}
      data-menu-scroll-action="page"
      data-testid={dataTestId}
      data-hidden={isHidden}
    >
      <span className={classes.icon}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 12">
          <path d="M6 6L.8 0 0 .7 4.7 6 0 11.3l.8.7z" />
        </svg>
      </span>
    </div>
  );
};

export default ScrollButton;
