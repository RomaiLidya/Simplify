import { RequestHandler } from 'express';
import httpContext from 'express-http-context';
import uuidv4 from 'uuid/v4';

export const addTransactionID: RequestHandler = (req, res, next) => {
  httpContext.set('transactionID', uuidv4());

  next();
};
