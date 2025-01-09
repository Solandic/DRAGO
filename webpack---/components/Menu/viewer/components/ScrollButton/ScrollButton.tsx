import classNames from 'clsx';
import React from 'react';
import type { ScrollButtonProps } from '../../../Menu.types';
import classes from './ScrollButton.scss';
import { semanticClassNames } from '../../../Menu.semanticClassNames';
import { formatClassNames } from '@wix/editor-elements-common-utils';

const iconClasses = classNames(
  classes.icon,
  formatClassNames(semanticClassNames.scrollButtonIcon),
);

const ScrollButton: React.FC<ScrollButtonProps> = props => {
  const {
    className: propClassName,
    onClick,
    direction,
    isHidden,
    dataPart,
    previewState,
  } = props;

  const rootClassName = classNames(
    classes.root,
    propClassName,
    isHidden ? classes.hidden : classes.visible,
    formatClassNames(semanticClassNames.scrollButton),
  );

  return (
    <div
      onClick={onClick}
      aria-hidden="true"
      aria-label="scroll"
      className={rootClassName}
      data-menu-scroll-action="page"
      data-hidden={isHidden}
      data-preview={previewState}
      data-part={dataPart}
    >
      <span className={iconClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 12">
          <path
            d={
              direction === 'forward'
                ? 'M6 6L.8 0 0 .7 4.7 6 0 11.3l.8.7z'
                : 'M0 6L5.2 0 6 .7 1.3 6 6 11.3 5.2 12z'
            }
          />
        </svg>
      </span>
    </div>
  );
};

export default ScrollButton;
