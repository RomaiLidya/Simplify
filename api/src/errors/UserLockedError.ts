import { UNAUTHORIZED } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class UserLockedError extends ErrorBase {
  public constructor(loginName: string) {
    super(`User: ${loginName} account is locked`, ErrorCodes.ACCOUNT_LOCKED_ERROR_CODE, UNAUTHORIZED);
  }
}

export default UserLockedError;
