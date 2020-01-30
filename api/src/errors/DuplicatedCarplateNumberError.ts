import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class DuplicatedCarplateNumberError extends ErrorBase {
  public constructor() {
    super('Duplicated Carplate Number', ErrorCodes.DUPLICATED_CARPLATE_NUMBER_ERROR_CODE, BAD_REQUEST);
  }
}

export default DuplicatedCarplateNumberError;
