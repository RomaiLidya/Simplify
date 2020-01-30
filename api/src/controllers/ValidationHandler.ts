import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import InputValidationError from '../errors/InputValidationError';

/**
 * This middleware will handle InputValidationError
 * It must be called after any validator (express-validator)
 *
 * @param req Request
 * @param res Response
 * @param next Next RequestHandler in the chain
 */
const ValidationHandler: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new InputValidationError());
  }

  return next();
};

export default ValidationHandler;
