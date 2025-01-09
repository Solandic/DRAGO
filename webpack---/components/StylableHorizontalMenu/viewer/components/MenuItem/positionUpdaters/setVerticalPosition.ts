import type { SubmenuMode } from '../../../../menuModeConstants';
import { getWixBannerHeight, setCss } from './helpers';
import type { Elements } from './types';

export const setVerticalPosition = (
  { positionBox, label }: Elements,
  submenuMode: SubmenuMode,
  compensateLabelMargin: number = 0,
): void => {
  const boxHeight = positionBox.getBoundingClientRect().height;
  const labelRect = label.getBoundingClientRect();

  const availableSpaceBelow = window.innerHeight - labelRect.bottom;
  const enoughSpaceBelow = availableSpaceBelow >= boxHeight;
  const availableSpaceAbove = labelRect.top - getWixBannerHeight();
  const enoughSpaceAbove = availableSpaceAbove >= boxHeight;

  if (enoughSpaceBelow) {
    setCss(positionBox, 'margin-top', -compensateLabelMargin, 'px');
    return;
  }

  if (enoughSpaceAbove) {
    const shiftTop = boxHeight + labelRect.height;

    setCss(positionBox, 'margin-top', -shiftTop - compensateLabelMargin, 'px');
  } else if (submenuMode === 'column') {
    // TODO: implement for flyout mode too
    setCss(positionBox, 'margin-top', -compensateLabelMargin, 'px');
    setCss(
      positionBox,
      '--animation-box-max-height',
      availableSpaceBelow,
      'px',
    );
    setCss(positionBox, '--animation-box-overflow-y', 'scroll');
  }
};
