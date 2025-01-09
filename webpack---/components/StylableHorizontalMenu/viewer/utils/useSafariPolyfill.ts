import { useEffect } from 'react';
import { isSafari } from '@wix/editor-elements-common-utils';
import { addFocusPolyfill } from './safariPolyfill';

export const useSafariPolyfill = () => {
  useEffect(() => {
    if (!isSafari()) {
      return;
    }
    const cleanup = addFocusPolyfill();
    return cleanup;
  }, []);
};
