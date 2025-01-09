import React from 'react';

import ScrollButton from '../ScrollButton/ScrollButton';
import type { ScrollControlsProps } from '../../../Menu.types';
import { MenuParts } from '../../constants';
import classes from './ScrollControls.scss';

export const ScrollControls: React.FC<ScrollControlsProps> = props => {
  const {
    isScrollBackwardButtonShown,
    isScrollForwardButtonShown,
    scrollPageForward,
    scrollPageToBackward,
    previewState,
  } = props;

  return (
    <div className={classes.root}>
      <ScrollButton
        direction="backward"
        onClick={scrollPageToBackward}
        isHidden={!isScrollBackwardButtonShown}
        dataPart={MenuParts.ScrollBackwardButton}
        previewState={previewState}
      />
      <ScrollButton
        direction="forward"
        onClick={scrollPageForward}
        isHidden={!isScrollForwardButtonShown}
        dataPart={MenuParts.ScrollForwardButton}
        previewState={previewState}
      />
    </div>
  );
};
