import express, { RequestHandler } from 'express';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import * as RoleService from '../services/RoleService';
import { OK } from 'http-status-codes';

const RoleController = express.Router();
const LOG = new Logger('RoleController.ts');

const getAllRolesHandler: RequestHandler = async (req, res, next) => {
  try {
    const roles = await RoleService.getAllRoles();

    return res.status(OK).json({
      roles
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

RoleController.get('/', Authentication.AUTHENTICATED, getAllRolesHandler);

export default RoleController;
