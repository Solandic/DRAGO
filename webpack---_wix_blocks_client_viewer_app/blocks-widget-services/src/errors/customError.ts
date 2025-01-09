import ExtendableError from 'es6-error';
import { isError } from './isErrorLike';

export class CustomError extends ExtendableError {
  constructor(name: string, message: string, public originalError: unknown) {
    super(message);
    this.name = name;
    if (isError(originalError)) {
      this.stack = originalError.stack;
    }
  }
}
