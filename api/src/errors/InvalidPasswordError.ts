import { UNAUTHORIZED } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';
import User from '../database/models/User';

class InvalidPasswordError extends ErrorBase {
  private user: User;

  public constructor(user: User) {
    super(`Invalid Credentials`, ErrorCodes.INVALID_CREDENTIALS_ERROR_CODE, UNAUTHORIZED);

    this.user = user;
  }

  public getUser(): User {
    return this.user;
  }
}

export default InvalidPasswordError;
