import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class InputValidationError extends ErrorBase {
  public constructor() {
    super('Invalid input', ErrorCodes.INPUT_VALIDATION_ERROR_CODE, BAD_REQUEST);
  }
}

export default InputValidationError;
