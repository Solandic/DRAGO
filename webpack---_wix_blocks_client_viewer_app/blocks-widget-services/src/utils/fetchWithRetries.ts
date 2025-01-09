import { AbortFetchError, isAbortFetchError } from '../errors/abortFetchError';
import { CustomTypeError } from '../errors/customTypeError';
import { FetchError } from '../errors/fetchError';

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const RETRIES = 2;

export const fetchWithRetries = async <T>(
  url: string,
  attempt = 0,
): Promise<T> => {
  let response;

  try {
    response = await fetch(url);

    if (response.ok) {
      return response.json();
    }

    throw new FetchError(url, response.status);
  } catch (e) {
    if (attempt === RETRIES) {
      const requestId = response?.headers?.get('x-wix-request-id') ?? null;

      if (e instanceof TypeError) {
        throw new CustomTypeError(url, requestId, e);
      }

      if (isAbortFetchError(e)) {
        throw new AbortFetchError(url, requestId, e);
      }

      throw e;
    }

    await wait(2 ** attempt * 10);

    return fetchWithRetries(url, attempt + 1);
  }
};
