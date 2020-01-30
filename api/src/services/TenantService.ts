import Logger from '../Logger';
import * as TenantDao from '../database/dao/TenantDao';
import * as UserDao from '../database/dao/UserDao';
import Tenant from '../database/models/Tenant';

const LOG = new Logger('TenantService.ts');

export const validateLicenseLimit = async (tenantKey: string): Promise<boolean> => {
  LOG.debug('Validating License Limit');

  const { numberOfLicense } = await TenantDao.getByTenantKey(tenantKey);
  const currentConsumedLicenseCount = await UserDao.countByTenantAndStatus(tenantKey, true);

  // Number of license must be bigger than current count.
  // Equal is considered as invalid as they cannot create more
  return numberOfLicense > currentConsumedLicenseCount;
};

export const getTenant = async (tenantKey: string): Promise<Tenant> => {
  LOG.debug('Getting Tenant from tenantKey');

  const tenant = await TenantDao.getByTenantKey(tenantKey);
  return tenant;
};
