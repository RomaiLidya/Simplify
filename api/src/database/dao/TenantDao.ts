import { getTenantModel } from '../models';
import Tenant from '../models/Tenant';

export const getByTenantKey = (tenantKey: string) => {
  const model = getTenantModel();

  return model.findByPk<Tenant>(tenantKey);
};
