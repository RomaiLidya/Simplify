import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class ExceededLicenseUsageError extends ErrorBase {
  public constructor() {
    super('Exceeded license usage', ErrorCodes.EXCEEDED_LICENSE_USAGE_ERROR_CODE, BAD_REQUEST);
  }
}

export default ExceededLicenseUsageError;
