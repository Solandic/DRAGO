import React from 'react';

import ScrollButton from '../ScrollButton/ScrollButton';
import type { ScrollControlsProps } from '../../../StylableHorizontalMenu.types';
import { testIds } from '../../testIds';
import { st, classes } from './ScrollControls.st.css';

export const ScrollControls: React.FC<ScrollControlsProps> = props => {
  const {
    isScrollLeftButtonShown,
    isScrollRightButtonShown,
    scrollPageToTheRight: scrollNextPage,
    scrollPageToTheLeft: scrollPrevPage,
  } = props;

  return (
    <div className={st(classes.root)}>
      <ScrollButton
        side="left"
        onClick={scrollPrevPage}
        isHidden={!isScrollLeftButtonShown}
        dataTestId={testIds.scrollPageToTheLeft}
      />
      <ScrollButton
        side="right"
        onClick={scrollNextPage}
        isHidden={!isScrollRightButtonShown}
        dataTestId={testIds.scrollPageToTheRight}
      />
    </div>
  );
};
