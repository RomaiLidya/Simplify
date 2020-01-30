import { getRoleModel } from '../models';
import Role from '../models/Role';

export const getAllRoles = () => {
  const model = getRoleModel();

  return model.findAll<Role>();
};
