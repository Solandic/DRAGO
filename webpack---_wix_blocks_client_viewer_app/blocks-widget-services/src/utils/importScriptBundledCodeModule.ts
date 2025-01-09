import { UserCodeNetworkError } from '../errors/userCodeNetworkError';

export const loadBundledCode = async <T extends Function>(
  codeUrl: string,
): Promise<{ init: T }> => {
  try {
    return await import(/* webpackIgnore: true */ codeUrl);
  } catch (e: any) {
    throw new UserCodeNetworkError(e, codeUrl);
  }
};
