import { UNAUTHORIZED } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class InvalidUserError extends ErrorBase {
  public constructor() {
    super(`Invalid Credentials`, ErrorCodes.INVALID_CREDENTIALS_ERROR_CODE, UNAUTHORIZED);
  }
}

export default InvalidUserError;
