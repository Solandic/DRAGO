import { CustomError } from './customError';
import { isError } from './isErrorLike';

export const ERROR_NAME = 'WidgetCreationError';

export class WidgetCreationError extends CustomError {
  originalMessage?: string;

  constructor(originalError: unknown) {
    super(ERROR_NAME, 'Failed running create widget function', originalError);
    if (isError(originalError)) {
      this.originalMessage = originalError.message;
    }
  }
}
