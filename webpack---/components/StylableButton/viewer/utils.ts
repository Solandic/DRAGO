import * as React from 'react';
import type { IStylableButtonCorvidStyleStateProps } from '../StylableButton.types';

export const createIconFromString = (svg: string) => {
  return React.createElement('span', {
    dangerouslySetInnerHTML: {
      __html: svg || '',
    },
  });
};

export const addPrefixToId = (svg: string, prefix: string): string => {
  if (!svg) {
    return svg;
  }

  return svg.replace(
    /(id="|url\(#|href="#)([^"]+)(?=[")])/g,
    (match, prefixOrUrlOrHref, id) => {
      return `${prefixOrUrlOrHref}${prefix + id}`;
    },
  );
};

const buildStyleStateKey = (key: string, state?: 'Hover' | 'Disabled') =>
  ['has', state, ...key.split('has').slice(1)].join('');

export function buildCorvidStyleStates({
  hover = {},
  disabled = {},
  ...regular
}: IStylableButtonCorvidStyleStateProps & {
  hover?: IStylableButtonCorvidStyleStateProps;
  disabled?: IStylableButtonCorvidStyleStateProps;
}) {
  return {
    ...regular,
    ...Object.fromEntries([
      ...Object.entries(hover).map(([key, value]) => [
        buildStyleStateKey(key, 'Hover'),
        value,
      ]),
      ...Object.entries(disabled).map(([key, value]) => [
        buildStyleStateKey(key, 'Disabled'),
        value,
      ]),
    ]),
  };
}
