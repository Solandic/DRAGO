import { CustomError } from './customError';

export const ERROR_NAME = 'FetchDescriptorError';

export class FetchDescriptorError extends CustomError {
  constructor(public url: string, originalError: unknown) {
    super(ERROR_NAME, 'Failed fetching widget descriptor', originalError);
  }
}
