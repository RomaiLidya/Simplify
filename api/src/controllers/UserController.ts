import express, { RequestHandler } from 'express';
import { OK, NO_CONTENT } from 'http-status-codes';
import { ValidationChain, body } from 'express-validator';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import ValidationHandler from './ValidationHandler';
import { JwtPayload } from '../typings/jwtPayload';
import * as UserService from '../services/UserService';
import * as TenantService from '../services/TenantService';
import { UserProfileWithPermissionsModel } from '../typings/UserProfileWithPermissionsModel';
import { createAuthorizer } from '../middleware/createAuthorizer';
import { Modules, AccessLevels } from '../database/models/Permission';

const UserController = express.Router();
const LOG = new Logger('UserController.ts');

interface SearchUserQueryParams {
  s: number;
  l?: number;
  q?: string;
  role?: string;
}

const getCurrentUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const user: JwtPayload = req.user;

    const [userProfile, tenant] = await Promise.all([UserService.getUserProfile(user.id), TenantService.getTenant(user.tenant)]);

    const userProfileWithPermissionsModel: UserProfileWithPermissionsModel = userProfile.toResponseFormat();
    userProfileWithPermissionsModel.permissions = user.permissions;
    userProfileWithPermissionsModel.tenant = tenant.name;

    return res.status(OK).json(userProfileWithPermissionsModel);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const searchUserAuthorizer = createAuthorizer({ module: Modules.USERS, accessLevel: AccessLevels.ACCESS });

const searchUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    const { s, l, q, role }: SearchUserQueryParams = req.query;

    const { rows, count } = await UserService.searchUsersWithPagination(s, l, q, role);

    return res.status(OK).json({
      count,
      users: rows
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const createUserAuthorizer = createAuthorizer({ module: Modules.USERS, accessLevel: AccessLevels.CREATE });

const createUserValidator: ValidationChain[] = [
  body('displayName', 'Display Name must not be empty')
    .not()
    .isEmpty(),
  body('email', 'Email must not be empty and is correct format')
    .not()
    .isEmpty()
    .isEmail(),
  body('contactNumber', 'Contact Number must not be empty')
    .not()
    .isEmpty(),
  body('roleId', 'Role must not be empty')
    .not()
    .isEmpty()
];

const createUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { tenant } = req.user;
    const { displayName, email, contactNumber, roleId } = req.body;

    const newUser = await UserService.createUser(displayName, email, contactNumber, roleId, tenant);

    return res.status(OK).json(newUser);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const editUserAuthorizer = createAuthorizer({ module: Modules.USERS, accessLevel: AccessLevels.EDIT });

const editUserValidator: ValidationChain[] = [
  body('email', 'Invalid email format')
    .optional()
    .isEmail()
];

const editUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { displayName, email, newPassword, contactNumber, roleId } = req.body;

    const editedUser = await UserService.editUser(id, displayName, email, newPassword, contactNumber, roleId);

    return res.status(OK).json(editedUser);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const activateUserAuthorizer = createAuthorizer({ module: Modules.USERS, accessLevel: AccessLevels.DELETE });

const activateUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await UserService.activateUser(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const deactivateUserAuthorizer = createAuthorizer({ module: Modules.USERS, accessLevel: AccessLevels.DELETE });

const deactivateUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await UserService.deactivateUser(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const unlockUserAuthorizer = createAuthorizer({ module: Modules.USERS, accessLevel: AccessLevels.EDIT });

const unlockUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await UserService.unlockUser(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const getActiveUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    const activeUsers = await UserService.getActiveUsers();

    return res.status(OK).json({
      activeUsers
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

UserController.get('/current', Authentication.AUTHENTICATED, getCurrentUserHandler);
UserController.put('/:id', Authentication.AUTHENTICATED, editUserAuthorizer, editUserValidator, ValidationHandler, editUserHandler);
UserController.post('/:id/activate', Authentication.AUTHENTICATED, activateUserAuthorizer, activateUserHandler);
UserController.post('/:id/unlock', Authentication.AUTHENTICATED, unlockUserAuthorizer, unlockUserHandler);
UserController.delete('/:id', Authentication.AUTHENTICATED, deactivateUserAuthorizer, deactivateUserHandler);
UserController.get('/', Authentication.AUTHENTICATED, searchUserAuthorizer, searchUsersHandler);
UserController.post('/', Authentication.AUTHENTICATED, createUserAuthorizer, createUserValidator, ValidationHandler, createUserHandler);
UserController.get('/active', Authentication.AUTHENTICATED, getActiveUsersHandler);

export default UserController;
