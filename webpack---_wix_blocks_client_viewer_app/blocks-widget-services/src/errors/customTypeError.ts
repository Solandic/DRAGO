import { CustomError } from './customError';

export const ERROR_NAME = 'CustomTypeError';

export const isCustomTypeError = (e: any): e is CustomTypeError =>
  e?.name === ERROR_NAME;

export class CustomTypeError extends CustomError {
  constructor(
    public url: string,
    public requestId: string | null,
    originalError: unknown,
  ) {
    super(ERROR_NAME, 'Load failed', originalError);
  }
}
