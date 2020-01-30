import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class JobNotFoundError extends ErrorBase {
  public constructor(identifier: string | number) {
    super(`Job: ${identifier} is not found`, ErrorCodes.JOB_NOT_FOUND_ERROR_CODE, BAD_REQUEST);
  }
}

export default JobNotFoundError;
