import { RequestHandler } from 'express';

import { PermissionResponseModel } from '../typings/ResponseFormats';
import InsufficientPermissionError from '../errors/InsufficientPermissionError';

export const createAuthorizer = (required: PermissionResponseModel): RequestHandler => (req, res, next) => {
  const { permissions }: { permissions: PermissionResponseModel[] } = req.user;

  const hasPermission =
    permissions.filter(permission => permission.module === required.module && permission.accessLevel === required.accessLevel).length > 0;

  if (!hasPermission) {
    throw new InsufficientPermissionError();
  }

  next();
};
