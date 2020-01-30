import express, { RequestHandler } from 'express';
import { OK, NO_CONTENT } from 'http-status-codes';
import { ValidationChain, body } from 'express-validator';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import ValidationHandler from './ValidationHandler';
import * as ServiceItemTemplateService from '../services/ServiceItemTemplateService';
import { AccessLevels, Modules } from '../database/models/Permission';
import { createAuthorizer } from '../middleware/createAuthorizer';

const ServiceItemTemplateController = express.Router();
const LOG = new Logger('ServiceItemTemplateController.ts');

interface SearchServiceItemTemplateQueryParams {
  s: number;
  l?: number;
  q?: string;
}

const searchServiceItemTemplateAuthorizer = createAuthorizer({ module: Modules.SERVICE_ITEM_TEMPLATES, accessLevel: AccessLevels.VIEW });

const searchServiceItemTemplateHandler: RequestHandler = async (req, res, next) => {
  try {
    const { s, l, q }: SearchServiceItemTemplateQueryParams = req.query;

    const { rows, count } = await ServiceItemTemplateService.searchServiceItemTemplatesWithPagination(s, l, q);

    return res.status(OK).json({
      count,
      serviceItemTemplates: rows.map(row => row.toResponseFormat())
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const createServiceItemTemplateAuthorizer = createAuthorizer({ module: Modules.SERVICE_ITEM_TEMPLATES, accessLevel: AccessLevels.CREATE });

const createServiceItemTemplateValidator: ValidationChain[] = [
  body('name', 'Task Name must not be empty')
    .not()
    .isEmpty(),
  body('unitPrice', 'Cost must not be empty')
    .not()
    .isEmpty()
];

const createServiceItemTemplateHandler: RequestHandler = async (req, res, next) => {
  try {
    const { name, description, unitPrice } = req.body;
    const newServiceItemTemplate = await ServiceItemTemplateService.createServiceItemTemplate(name, description, unitPrice);

    return res.status(OK).json(newServiceItemTemplate);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const editServiceItemTemplateAuthorizer = createAuthorizer({ module: Modules.SERVICE_ITEM_TEMPLATES, accessLevel: AccessLevels.EDIT });

const editServiceItemTemplateValidator: ValidationChain[] = [
  body('name', 'Task Name must not be empty')
    .not()
    .isEmpty(),
  body('unitPrice', 'Cost must not be empty')
    .not()
    .isEmpty()
];

const editServiceItemTemplateHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, unitPrice } = req.body;
    const editedServiceItemTemplate = await ServiceItemTemplateService.editServiceItemTemplate(id, name, description, unitPrice);

    return res.status(OK).json(editedServiceItemTemplate);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const deleteServiceItemTemplateAuthorizer = createAuthorizer({ module: Modules.SERVICE_ITEM_TEMPLATES, accessLevel: AccessLevels.DELETE });

const deleteServiceItemTemplateHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await ServiceItemTemplateService.deleteServiceItemTemplate(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

ServiceItemTemplateController.get('/', Authentication.AUTHENTICATED, searchServiceItemTemplateAuthorizer, searchServiceItemTemplateHandler);
ServiceItemTemplateController.post(
  '/',
  Authentication.AUTHENTICATED,
  createServiceItemTemplateAuthorizer,
  createServiceItemTemplateValidator,
  ValidationHandler,
  createServiceItemTemplateHandler
);
ServiceItemTemplateController.put(
  '/:id',
  Authentication.AUTHENTICATED,
  editServiceItemTemplateAuthorizer,
  editServiceItemTemplateValidator,
  ValidationHandler,
  editServiceItemTemplateHandler
);
ServiceItemTemplateController.delete('/:id', Authentication.AUTHENTICATED, deleteServiceItemTemplateAuthorizer, deleteServiceItemTemplateHandler);

export default ServiceItemTemplateController;
