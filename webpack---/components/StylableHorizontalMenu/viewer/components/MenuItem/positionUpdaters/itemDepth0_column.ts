import { isSafari } from '@wix/editor-elements-common-utils';
import type { MenuMode } from '../../../../menuModeConstants';
import type { PositionUpdaters } from './types';
import { getCss, setCss, clearCss } from './helpers';
import { setVerticalPosition } from './setVerticalPosition';

const forceRepaintOnSafari = (positionBox: HTMLElement) => {
  if (!isSafari()) {
    return;
  }

  setCss(positionBox, 'display', 'none');
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  positionBox.offsetHeight;
  setCss(positionBox, 'display', '');
};

export const createDepth0PositionUpdaters_column =
  (menuMode: MenuMode): PositionUpdaters =>
  ({ label, positionBox, isStretched }) => ({
    onEnter: () => {
      const labelMarginToCompensate =
        menuMode === 'wrap' ? getCss(label, 'margin-bottom') : '0';

      setVerticalPosition(
        { label, positionBox },
        'column',
        parseInt(labelMarginToCompensate, 10),
      );
      if (isStretched) {
        const { left = 0, right = 0 } =
          label.closest('nav')?.getBoundingClientRect() || {};
        setCss(
          positionBox,
          'right',
          -(document.body.clientWidth - right),
          'px',
        );
        setCss(positionBox, 'left', -left, 'px');

        // ECL-7518 Safari doesn't always render it properly from first try 🤷‍♂️
        forceRepaintOnSafari(positionBox);
      }
    },
    onLeave: () => {
      clearCss(positionBox);
    },
  });
