import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class ClientNotFoundError extends ErrorBase {
  public constructor(identifier: string | number) {
    super(`Client: ${identifier} is not found`, ErrorCodes.CLIENT_NOT_FOUND_ERROR_CODE, BAD_REQUEST);
  }
}

export default ClientNotFoundError;
