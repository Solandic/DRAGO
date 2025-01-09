import { isSafari } from '@wix/editor-elements-common-utils';

const easeOutQuart = (time: number) => 1 - Math.pow(1 - time, 4);
const scrollLeftProperty = 'scrollLeft';

const scrollSafari = (element: HTMLElement, moveTo: number, duration = 700) => {
  const ease = easeOutQuart;
  const startPoint = element[scrollLeftProperty];
  let start: null | number = null;

  const step = (timestamp: number) => {
    if (start === null) {
      start = timestamp;
    }

    const time = Math.min(1, (timestamp - start) / duration);
    element[scrollLeftProperty] =
      startPoint + ease(time) * (moveTo - startPoint);

    if (time === 1) {
      start = null;
    } else {
      requestAnimationFrame(step);
    }
  };

  if (startPoint !== moveTo) {
    requestAnimationFrame(step);
  }
};

const scrollNative = (element: HTMLElement, moveTo: number) => {
  element.scrollTo({
    left: moveTo,
    top: 0,
    behavior: 'smooth',
  });
};

export const scrollTo = (element: HTMLElement, moveTo: number) =>
  (isSafari() ? scrollSafari : scrollNative)(element, moveTo);
