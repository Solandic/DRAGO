export const getWixBannerHeight = (): number => {
  const cssVarHeight = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--wix-ads-height');

  return Number.parseInt(cssVarHeight, 10) || 0;
};

export const setCss = (
  el: HTMLElement,
  key: string,
  value: string | number,
  units = '',
) => {
  const improvedValue = typeof value === 'number' ? Math.round(value) : value;
  el.style.setProperty(key, `${improvedValue}${units}`);
};

export const getCss = (el: HTMLElement, key: string) =>
  window.getComputedStyle(el).getPropertyValue(key);

export const clearCss = (el: HTMLElement) => {
  el.removeAttribute('style');
};
