import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class VehicleNotFoundError extends ErrorBase {
  public constructor(identifier: string | number) {
    super(`Vehicle: ${identifier} is not found`, ErrorCodes.VEHICLE_NOT_FOUND_ERROR_CODE, BAD_REQUEST);
  }
}

export default VehicleNotFoundError;
