import Logger from '../Logger';
import { RoleResponseModel } from '../typings/ResponseFormats';
import * as RoleDao from '../database/dao/RoleDao';

const LOG = new Logger('RoleService.ts');

export const getAllRoles = async (): Promise<RoleResponseModel[]> => {
  LOG.debug('Getting all roles');

  const roles = await RoleDao.getAllRoles();

  return roles.map(role => role.toResponseFormat());
};
