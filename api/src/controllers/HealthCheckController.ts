import express, { RequestHandler } from 'express';
import Logger from '../Logger';
import { OK } from 'http-status-codes';

const HealthCheckController = express.Router();
const LOG = new Logger('ClientController.ts');

const healthCheckHandler: RequestHandler = async (req, res, next) => {
  try {
    LOG.info('Health check successful');

    return res.sendStatus(OK);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

HealthCheckController.get('/', healthCheckHandler);

export default HealthCheckController;
