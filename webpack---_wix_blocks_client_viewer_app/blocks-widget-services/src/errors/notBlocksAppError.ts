import ExtendableError from 'es6-error';

const ERROR_NAME = 'NotBlocksAppError';

export class NotBlocksAppError extends ExtendableError {
  constructor() {
    super('Not a blocks app - Missing blocksData in app params');
    this.name = ERROR_NAME;
  }
}
