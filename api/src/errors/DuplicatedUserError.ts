import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class DuplicatedUserError extends ErrorBase {
  public constructor() {
    super('Duplicated User', ErrorCodes.DUPLICATED_USER_ERROR_CODE, BAD_REQUEST);
  }
}

export default DuplicatedUserError;
