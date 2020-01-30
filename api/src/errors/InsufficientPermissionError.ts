import { UNAUTHORIZED } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class InsufficientPermissionError extends ErrorBase {
  public constructor() {
    super('Insufficient Permissions', ErrorCodes.INSUFFICIENT_PERMISSION_ERROR_CODE, UNAUTHORIZED);
  }
}

export default InsufficientPermissionError;
