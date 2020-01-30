import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class ServiceNotFoundError extends ErrorBase {
  public constructor(identifier: string | number) {
    super(`Service: ${identifier} is not found`, ErrorCodes.SERVICE_NOT_FOUND_ERROR_CODE, BAD_REQUEST);
  }
}

export default ServiceNotFoundError;
