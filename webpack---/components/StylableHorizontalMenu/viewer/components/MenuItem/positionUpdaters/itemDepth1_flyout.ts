import { getIsRTL } from '../../../../../../common/menu/getIsRTL';
import type { PositionUpdaters } from './types';

const REVERTED = 'data-reverted';

const getDirectionCssVars = (isRTL: boolean): Array<string> => [
  `--subsubmenu-box-left:${isRTL ? 'unset' : '100%'}`,
  `--subsubmenu-box-right:${isRTL ? '100%' : 'unset'}`,
];

const getPositionStyles = (submenu: HTMLElement): Array<string> => {
  const { paddingTop, paddingLeft, paddingRight, borderTopWidth } =
    window.getComputedStyle(submenu);

  return [
    // padding is needed to not loose hover when cursor is moving to sub sub menu
    `padding-left:${paddingLeft}`,
    `padding-right:${paddingRight}`,
    // negative margin is needed to align items properly
    `margin-top:-${
      Number.parseInt(paddingTop, 10) + Number.parseInt(borderTopWidth, 10)
    }px`,
  ];
};

const getShouldBeReverted = (
  label: HTMLElement,
  positionBox: HTMLElement,
  isRTL: boolean,
) => {
  const { left, right } = label.getBoundingClientRect();

  // align should be reverted if there is not enough space for element to render
  return isRTL
    ? left - positionBox.offsetWidth < 0 // left edge is out of viewport
    : right + positionBox.offsetWidth > document.body.offsetWidth; // right edge is out of viewport
};

export const depth1PositionUpdaters_flyout: PositionUpdaters = ({
  positionBox,
  label,
}) => ({
  onEnter: () => {
    const isRTL = getIsRTL(positionBox);

    if (getShouldBeReverted(label, positionBox, isRTL)) {
      positionBox.setAttribute(REVERTED, '');
    }

    positionBox.style.cssText = [
      ...getDirectionCssVars(isRTL),
      ...getPositionStyles(positionBox.firstChild as HTMLElement),
    ].join(';');
  },
  onLeave: () => {
    positionBox.removeAttribute(REVERTED);
    positionBox.removeAttribute('style');
  },
});
