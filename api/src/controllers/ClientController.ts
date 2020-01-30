import express, { RequestHandler } from 'express';
import { body, ValidationChain } from 'express-validator';
import { OK } from 'http-status-codes';
import { Authentication } from '../config/passport';
import { ClientTypes } from '../database/models/Client';
import { AccessLevels, Modules } from '../database/models/Permission';
import Logger from '../Logger';
import { createAuthorizer } from '../middleware/createAuthorizer';
import * as ClientService from '../services/ClientService';
import ValidationHandler from './ValidationHandler';

const ClientController = express.Router();
const LOG = new Logger('ClientController.ts');

interface SearchClientQueryParams {
  s: number;
  l?: number;
  q?: string;
  type?: ClientTypes;
}

const searchClientAuthorizer = createAuthorizer({ module: Modules.CLIENTS, accessLevel: AccessLevels.ACCESS });

const searchClientHandler: RequestHandler = async (req, res, next) => {
  try {
    const { s, l, q, type }: SearchClientQueryParams = req.query;

    const { rows, count } = await ClientService.searchClientsWithPagination(s, l, q, type);

    return res.status(OK).json({
      count,
      clients: rows.map(row => row.toResponseFormat())
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

interface ServiceAddressBodyParam {
  contactPerson: string;
  contactNumber: string; // to cater for country code
  country: string;
  address: string;
  postalCode: string;
}

interface CreateClientBodyParam {
  name: string;
  clientType: ClientTypes;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  secondaryContactPerson: string;
  secondaryContactNumber: string;
  secondaryContactEmail: string;
  country: string;
  billingAddress: string;
  billingPostal: string;
  needGST: boolean;
  paymentStatus: string;
  serviceAddreses: ServiceAddressBodyParam[];
}

const createClientAuthorizer = createAuthorizer({ module: Modules.CLIENTS, accessLevel: AccessLevels.CREATE });

const createClientValidator: ValidationChain[] = [
  body('name', 'Name must not be empty')
    .not()
    .isEmpty(),
  body('clientType', 'Client Type must not be empty and of the correct type')
    .not()
    .isEmpty()
    .custom(value => Object.values(ClientTypes).includes(value)),
  body('contactPerson', 'Contact Person must not be empty')
    .not()
    .isEmpty(),
  body('contactNumber', 'Contact Number must not be empty')
    .not()
    .isEmpty(),
  body('contactEmail', 'Contact email must be of correct format').isEmail(),
  body('country', 'Country must not be empty')
    .not()
    .isEmpty(),
  body('billingAddress', 'Billing Address must not be empty')
    .not()
    .isEmpty(),
  body('billingPostal', 'Billing Postal must not be empty')
    .not()
    .isEmpty(),
  body('needGST', 'needGST must not be empty')
    .not()
    .isEmpty(),
  body('serviceAddreses', 'Service Addresses must not be empty')
    .not()
    .isArray()
    .isEmpty()
];

const createClientHandler: RequestHandler = async (req, res, next) => {
  try {
    const {
      name,
      clientType,
      contactPerson,
      contactNumber,
      contactEmail,
      secondaryContactPerson,
      secondaryContactNumber,
      secondaryContactEmail,
      country,
      billingAddress,
      billingPostal,
      needGST,
      paymentStatus
    }: CreateClientBodyParam = req.body;

    const newClient = await ClientService.createClient(
      name,
      clientType,
      contactPerson,
      contactNumber,
      contactEmail,
      secondaryContactPerson,
      secondaryContactNumber,
      secondaryContactEmail,
      country,
      billingAddress,
      billingPostal,
      needGST,
      paymentStatus
    );

    return res.status(OK).json(newClient);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const editClientAuthorizer = createAuthorizer({ module: Modules.CLIENTS, accessLevel: AccessLevels.EDIT });

const editClientValidator: ValidationChain[] = [
  body('name', 'Name must not be empty')
    .not()
    .isEmpty(),
  body('clientType', 'Client Type must not be empty and of the correct type')
    .not()
    .isEmpty()
    .custom(value => Object.values(ClientTypes).includes(value)),
  body('contactPerson', 'Contact Person must not be empty')
    .not()
    .isEmpty(),
  body('contactNumber', 'Contact Number must not be empty')
    .not()
    .isEmpty(),
  body('contactEmail', 'Contact email must be of correct format').isEmail(),
  body('country', 'Country must not be empty')
    .not()
    .isEmpty(),
  body('billingAddress', 'Billing Address must not be empty')
    .not()
    .isEmpty(),
  body('billingPostal', 'Billing Postal must not be empty')
    .not()
    .isEmpty(),
  body('needGST', 'needGST must not be empty')
    .not()
    .isEmpty(),
  body('serviceAddreses', 'Service Addresses must not be empty')
    .not()
    .isArray()
    .isEmpty()
];

const editClientHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      clientType,
      contactPerson,
      contactNumber,
      contactEmail,
      secondaryContactPerson,
      secondaryContactNumber,
      secondaryContactEmail,
      country,
      billingAddress,
      billingPostal,
      needGST,
      paymentStatus
    }: CreateClientBodyParam = req.body;
    const editedClient = await ClientService.editClient(
      id,
      name,
      clientType,
      contactPerson,
      contactNumber,
      contactEmail,
      secondaryContactPerson,
      secondaryContactNumber,
      secondaryContactEmail,
      country,
      billingAddress,
      billingPostal,
      needGST,
      paymentStatus
    );

    return res.status(OK).json(editedClient);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const getClientAuthorizer = createAuthorizer({ module: Modules.CLIENTS, accessLevel: AccessLevels.VIEW });

const getClientByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await ClientService.getClientById(id);

    return res.status(OK).json({
      client
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

ClientController.get('/', Authentication.AUTHENTICATED, searchClientAuthorizer, searchClientHandler);
ClientController.post('/', Authentication.AUTHENTICATED, createClientAuthorizer, createClientValidator, ValidationHandler, createClientHandler);
ClientController.get('/:id', Authentication.AUTHENTICATED, getClientAuthorizer, getClientByIdHandler);
ClientController.put('/:id', Authentication.AUTHENTICATED, editClientAuthorizer, editClientValidator, ValidationHandler, editClientHandler);

export default ClientController;
