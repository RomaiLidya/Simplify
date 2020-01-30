import express, { RequestHandler } from 'express';
import { OK, NO_CONTENT } from 'http-status-codes';
import { ValidationChain, body } from 'express-validator';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import ValidationHandler from './ValidationHandler';
import * as EntityService from '../services/EntityService';
import { AccessLevels, Modules } from '../database/models/Permission';
import { createAuthorizer } from '../middleware/createAuthorizer';

const EntityController = express.Router();
const LOG = new Logger('EntityController.ts');

interface EntityAddressBodyParam {
  address: string;
  // postalCode: string;
  // unitNumber: string;
}

interface CreateEntityBodyParam {
  id: number;
  name: string;
  address: string;
  logo: string;
  contactNumber: string;
  entityAddres: EntityAddressBodyParam[];
}

const createEntityAuthorizer = createAuthorizer({ module: Modules.ENTITIES, accessLevel: AccessLevels.CREATE });

const createEntityValidator: ValidationChain[] = [
  body('name', 'Company Name must not be empty')
    .not()
    .isEmpty(),
  body('address', 'Address must not be empty')
    .not()
    .isEmpty(),
  // body('postalCode', 'Postal Code must not be empty')
  //   .not()
  //   .isEmpty(),
  body('logo', 'Logo must not be empty')
    .not()
    .isEmpty(),
  body('contactNumber', 'Contact Number must not be empty')
    .not()
    .isEmpty()
];

console.log('createEntityHandler', createEntityValidator);

const createEntityHandler: RequestHandler = async (req, res, next) => {
  try {
    const { name, address, logo, contactNumber }: CreateEntityBodyParam = req.body;

    const newEntity = await EntityService.createEntity(name, address, logo, contactNumber);
    // const file = req.file as any;
    // const newEntity = await ServiceItemTemplateService.createServiceItemTemplate(name, description, unitPrice);

    // return res.status(OK).json(newEntity);
    return res.status(OK).json(newEntity);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const searchEntityAuthorizer = createAuthorizer({ module: Modules.ENTITIES, accessLevel: AccessLevels.VIEW });
console.log('apasiiiii', searchEntityAuthorizer);

const searchEntityHandler: RequestHandler = async (req, res, next) => {
  try {
    const { name, address, logo, contactNumber }: CreateEntityBodyParam = req.query;

    const { entities } = await EntityService.searchEntityWithPagination(name, address, logo, contactNumber);
    console.log('searchJobHandler', searchEntityHandler);
    return res.status(OK).json({
      entities
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};
const deleteEntityAuthorizer = createAuthorizer({ module: Modules.ENTITIES, accessLevel: AccessLevels.DELETE });

const deleteEntityHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await EntityService.deleteEntity(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};
EntityController.delete('/:id', Authentication.AUTHENTICATED, deleteEntityAuthorizer, deleteEntityHandler);
EntityController.post('/', Authentication.AUTHENTICATED, createEntityAuthorizer, createEntityValidator, ValidationHandler, createEntityHandler);
EntityController.get('/', Authentication.AUTHENTICATED, searchEntityHandler, searchEntityAuthorizer);
export default EntityController;
