export const getIsRTL = (node: HTMLElement) =>
  window.getComputedStyle(node).direction === 'rtl';
