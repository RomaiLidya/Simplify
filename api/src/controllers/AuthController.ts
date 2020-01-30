import express, { RequestHandler } from 'express';
import { OK } from 'http-status-codes';
import uuidv4 from 'uuid/v4';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import User from '../database/models/User';
import * as AuthService from '../services/AuthService';
import * as UserService from '../services/UserService';
import * as TenantService from '../services/TenantService';
import { UserProfileWithPermissionsModel } from '../typings/UserProfileWithPermissionsModel';
import { PermissionResponseModel } from '../typings/ResponseFormats';

const AuthController = express.Router();
const LOG = new Logger('AuthController.ts');

const authenticationSuccessHandler: RequestHandler = async (req, res, next) => {
  try {
    const user: User = req.user;
    const userId = user.get('id');
    const tenantKey = user.get('TenantKey');
    const sessionId: string = uuidv4();
    const [, , tenant, userProfile, permissions] = await Promise.all([
      AuthService.resetInvalidLoginCounts(user),
      AuthService.createSession(user, sessionId),
      TenantService.getTenant(tenantKey),
      UserService.getUserProfile(userId),
      UserService.getUserPermissions(userId)
    ]);

    const userProfileWithPermissionsModel: UserProfileWithPermissionsModel = userProfile.toResponseFormat();
    const permissionsResponseModels: PermissionResponseModel[] = permissions.map(permission => permission.toResponseFormat());
    const tenantName = tenant.name;
    userProfileWithPermissionsModel.permissions = permissionsResponseModels;
    userProfileWithPermissionsModel.tenant = tenantName;

    return res.status(OK).json({
      token: AuthService.generateUserJwt(user, permissionsResponseModels, sessionId),
      currentUser: userProfileWithPermissionsModel
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const logoutHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id, jti } = req.user;

    await AuthService.destroySession(id, jti);

    return res.sendStatus(OK);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

AuthController.post('/login', Authentication.TO_AUTHENTICATE, authenticationSuccessHandler);
AuthController.post('/logout', Authentication.AUTHENTICATED, logoutHandler);

export default AuthController;
