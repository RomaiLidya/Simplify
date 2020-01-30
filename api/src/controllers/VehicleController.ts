import express, { RequestHandler } from 'express';
import { OK, NO_CONTENT } from 'http-status-codes';
import { ValidationChain, body } from 'express-validator';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import ValidationHandler from './ValidationHandler';
import * as VehicleService from '../services/VehicleService';
import { AccessLevels, Modules } from '../database/models/Permission';
import { createAuthorizer } from '../middleware/createAuthorizer';

const VehicleController = express.Router();
const LOG = new Logger('VehicleController.ts');

interface VehicleQueryParams {
  s: number;
  l?: number;
  q?: string;
}

const searchVehicleAuthorizer = createAuthorizer({ module: Modules.VEHICLES, accessLevel: AccessLevels.VIEW });

const searchVehicleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { s, l, q }: VehicleQueryParams = req.query;

    const { rows, count } = await VehicleService.searchVehiclesWithPagination(s, l, q);

    return res.status(OK).json({
      count,
      vehicles: rows
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const createVehicleAuthorizer = createAuthorizer({ module: Modules.VEHICLES, accessLevel: AccessLevels.CREATE });

const createVehicleValidator: ValidationChain[] = [
  body('carplateNumber', 'Vehicle number must not be empty')
    .not()
    .isEmpty()
];

const createVehicleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { model, carplateNumber, coeExpiryDate, vehicleStatus, employeeId } = req.body;
    const newVehicle = await VehicleService.createVehicle(model, carplateNumber, coeExpiryDate, vehicleStatus, employeeId);

    return res.status(OK).json(newVehicle);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const editVehicleAuthorizer = createAuthorizer({ module: Modules.VEHICLES, accessLevel: AccessLevels.EDIT });

const editVehicleValidator: ValidationChain[] = [
  body('carplateNumber', 'Vehicle number must not be empty')
    .not()
    .isEmpty()
];

const editVehicleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { model, carplateNumber, coeExpiryDate, vehicleStatus, employeeId } = req.body;
    const editedVehicle = await VehicleService.editVehicle(id, model, carplateNumber, coeExpiryDate, vehicleStatus, employeeId);

    return res.status(OK).json(editedVehicle);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const activateVehicleAuthorizer = createAuthorizer({ module: Modules.VEHICLES, accessLevel: AccessLevels.EDIT });

const activateVehicleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await VehicleService.activateVehicle(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const deactivateVehicleAuthorizer = createAuthorizer({ module: Modules.VEHICLES, accessLevel: AccessLevels.EDIT });

const deactivateVehicleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await VehicleService.deactivateVehicle(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const deleteVehicleAuthorizer = createAuthorizer({ module: Modules.VEHICLES, accessLevel: AccessLevels.DELETE });

const deleteVehicleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await VehicleService.deleteVehicle(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

VehicleController.get('/', Authentication.AUTHENTICATED, searchVehicleAuthorizer, searchVehicleHandler);
VehicleController.post('/', Authentication.AUTHENTICATED, createVehicleAuthorizer, createVehicleValidator, ValidationHandler, createVehicleHandler);
VehicleController.put('/:id', Authentication.AUTHENTICATED, editVehicleAuthorizer, editVehicleValidator, ValidationHandler, editVehicleHandler);
VehicleController.post('/:id/activate', Authentication.AUTHENTICATED, activateVehicleAuthorizer, activateVehicleHandler);
VehicleController.post('/:id/deactivate', Authentication.AUTHENTICATED, deactivateVehicleAuthorizer, deactivateVehicleHandler);
VehicleController.delete('/:id', Authentication.AUTHENTICATED, deleteVehicleAuthorizer, deleteVehicleHandler);

export default VehicleController;
