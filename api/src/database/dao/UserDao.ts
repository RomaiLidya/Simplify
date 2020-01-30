import { getUserModel } from '../models';
import { Transaction, FindOptions } from 'sequelize';
import { hashPassword } from '../../services/PasswordService';
import User from '../models/User';

export const createUser = async (loginName: string, clearPassword: string, tenant: string, transaction: Transaction) => {
  const model = getUserModel();

  return model.create<User>(
    {
      loginName,
      password: await hashPassword(clearPassword),
      TenantKey: tenant
    },
    { transaction }
  );
};

export const getById = (id: number, findOption?: FindOptions) => {
  const model = getUserModel();

  return model.findByPk<User>(id, findOption);
};

export const getByLoginName = (loginName: string) => {
  const model = getUserModel();

  return model.findOne<User>({ where: { loginName } });
};

export const countById = (id: number) => {
  const model = getUserModel();

  return model.count({ where: { id } });
};

export const countByLoginName = (loginName: string) => {
  const model = getUserModel();

  return model.count({ where: { loginName } });
};

export const countByTenantAndStatus = (tenantKey: string, active: boolean) => {
  const model = getUserModel();

  return model.count({ where: { TenantKey: tenantKey, active } });
};

export const deactivateUserById = (id: number) => {
  const model = getUserModel();

  return model.update<User>({ active: false }, { where: { id } });
};
