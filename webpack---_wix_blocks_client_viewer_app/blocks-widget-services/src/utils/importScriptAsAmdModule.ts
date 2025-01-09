/**
 * Need to get this from @wix/wix-code-viewer-utils
 */

import { ERRORS } from '../constants';
import { UserCodeNetworkError } from '../errors/userCodeNetworkError';

interface Define {
  (_: unknown, module: any): void;
  amd: boolean;
}

declare global {
  interface WorkerGlobalScope {
    define?: Define;
  }
}

export const importSync = <T extends Function>(url: string): T => {
  let definedModule: T;
  const oldDefine = self.define;
  const overriddenDefine = function define(_: unknown, mod: T) {
    definedModule = mod;
  };
  overriddenDefine.amd = true;

  self.define = overriddenDefine;

  try {
    self.importScripts(url);
    return definedModule!;
  } catch (e: any) {
    if (
      e &&
      (e.name === ERRORS.NETWORK_ERROR || e.name === ERRORS.NS_BINDING_ABORTED)
    ) {
      throw new UserCodeNetworkError(e, url);
    }

    throw e;
  } finally {
    /* istanbul ignore if */
    if (oldDefine) {
      self.define = oldDefine;
    } else {
      delete self.define;
    }
  }
};

export const loadWidgetModule = <T extends Function>(widgetCodeUrl: string) => {
  try {
    return importSync<T>(widgetCodeUrl);
  } catch (e) {
    return () => {
      throw e;
    };
  }
};
