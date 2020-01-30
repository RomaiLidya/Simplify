import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class EntityNotFoundError extends ErrorBase {
  public constructor(identifier: string | number) {
    super(`Entity: ${identifier} is not found`, ErrorCodes.ENTITY_NOT_FOUND_ERROR_CODE, BAD_REQUEST);
  }
}

export default EntityNotFoundError;
