import ExtendableError from 'es6-error';

export const ERROR_NAME = 'FetchError';

export const isFetchError = (e: any): e is FetchError => e?.name === ERROR_NAME;

export class FetchError extends ExtendableError {
  constructor(public url: string, public statusCode: number) {
    super('Fetch failed');
    this.name = ERROR_NAME;
  }
}
