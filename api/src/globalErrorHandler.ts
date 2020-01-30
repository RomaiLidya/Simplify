import { ErrorRequestHandler } from 'express-serve-static-core';
import { BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import ErrorCodes from './constants/ErrorCodes';
import ErrorBase from './errors/ErrorBase';
import InvalidPasswordError from './errors/InvalidPasswordError';
import { checkInvalidLoginCountsAndLock } from './services/AuthService';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Handling of body-parser content malformed error
  if (err.type === 'entity.parse.failed') {
    return res.status(BAD_REQUEST).send({
      errorCode: ErrorCodes.MALFORMED_JSON_ERROR_CODE,
      message: 'Malformed json'
    });
  }

  // Handling passport unauthorized error
  if (err.name === 'AuthenticationError') {
    return res.status(UNAUTHORIZED).send({
      errorCode: ErrorCodes.PASSPORT_UNAUTHORIZED_ERROR_CODE,
      message: 'Unauthorized'
    });
  }

  if (err instanceof ErrorBase) {
    const error: ErrorBase = err;

    return res.status(error.getHttpStatusCode()).send({
      errorCode: error.getErrorCode(),
      message: error.getMessage()
    });
  } else {
    return res.status(INTERNAL_SERVER_ERROR).send({
      errorCode: ErrorCodes.RUNTIME_ERROR_CODE,
      message: 'Internal Server Error'
    });
  }

  return next(err);
};

export const authenticationFailureHandler: ErrorRequestHandler = async (err, req, res, next) => {
  // This handler only handle InvalidPasswordError
  if (err instanceof InvalidPasswordError) {
    const user = (err as InvalidPasswordError).getUser();
    checkInvalidLoginCountsAndLock(user);
  }

  next(err);
};

export default globalErrorHandler;
