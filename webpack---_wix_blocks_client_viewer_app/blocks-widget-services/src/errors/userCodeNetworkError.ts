import ExtendableError from 'es6-error';

export const ERROR_NAME = 'UserCodeNetworkError';

export class UserCodeNetworkError extends ExtendableError {
  originalError: Error;
  url: string;

  constructor(originalError: Error, url: string) {
    super(`Failed to import user code script: ${originalError.message}`);
    this.name = ERROR_NAME;
    this.originalError = originalError;
    this.url = url;
  }
}
