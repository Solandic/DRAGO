import { CustomError } from './customError';

export const ERROR_NAME = 'AbortError';

export const isAbortFetchError = (e: any): e is AbortFetchError =>
  e?.name === ERROR_NAME;

export class AbortFetchError extends CustomError {
  constructor(
    public url: string,
    public requestId: string | null,
    originalError: unknown,
  ) {
    super(ERROR_NAME, 'Fetch aborted', originalError);
  }
}
