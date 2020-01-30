import express, { RequestHandler } from 'express';
import { OK, NO_CONTENT } from 'http-status-codes';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import * as ServiceService from '../services/ServiceService';
import { AccessLevels, Modules } from '../database/models/Permission';
import { createAuthorizer } from '../middleware/createAuthorizer';

const ServiceController = express.Router();
const LOG = new Logger('ServiceController.ts');

interface ServiceQueryParams {
  s: number; // is offset for pagination search
  l?: number; // limit for pagination search
  q?: string; // query for searching
  c?: string; // filter for contract flag (all, active, expiring, expired)
  fb?: string; // filter by for term (termStart, termEnd)
  sd?: string; // start date value
  ed?: string; // end date value
  ci?: number; // client id value
  ei?: number; // entity id date value
}

const searchServiceAuthorizer = createAuthorizer({ module: Modules.SERVICES, accessLevel: AccessLevels.VIEW });

const searchServiceHandler: RequestHandler = async (req, res, next) => {
  try {
    const { s, l, q, c, fb, sd, ed, ci, ei }: ServiceQueryParams = req.query;

    const { rows, count, clients, entities } = await ServiceService.searchServicesWithPagination(s, l, q, c, fb, sd, ed, ci, ei);

    return res.status(OK).json({
      count,
      contracts: rows,
      clients,
      entities
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const editServiceAuthorizer = createAuthorizer({ module: Modules.SERVICES, accessLevel: AccessLevels.EDIT });

const editInvoiceNumberHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { invoiceNo } = req.body;
    const editedInvoiceNumber = await ServiceService.editInvoiceNumber(id, invoiceNo);

    return res.status(OK).json(editedInvoiceNumber);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const deleteServiceAuthorizer = createAuthorizer({ module: Modules.SERVICES, accessLevel: AccessLevels.DELETE });

const deleteServiceHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await ServiceService.deleteService(id.split(','));

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

ServiceController.get('/', Authentication.AUTHENTICATED, searchServiceAuthorizer, searchServiceHandler);
ServiceController.put('/:id', Authentication.AUTHENTICATED, editServiceAuthorizer, editInvoiceNumberHandler);
ServiceController.delete('/:id', Authentication.AUTHENTICATED, deleteServiceAuthorizer, deleteServiceHandler);

export default ServiceController;
