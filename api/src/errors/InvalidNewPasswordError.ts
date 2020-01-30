import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class InvalidNewPasswordError extends ErrorBase {
  public constructor() {
    super('New password does not fulfil the password policy', ErrorCodes.INVALID_NEW_PASSWORD_ERROR_CODE, BAD_REQUEST);
  }
}

export default InvalidNewPasswordError;
