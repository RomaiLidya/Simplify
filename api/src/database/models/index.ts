import httpContext from 'express-http-context';

import { models as Models } from '../../config/database';
import TableNames from '../enums/TableNames';

export const getTenantModel = () => {
  return Models.Tenant.schema('shared');
};

export const getUserModel = () => {
  return Models.User.schema('shared');
};

export const getUserProfileModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.UserProfile.schema(tenant);
};

export const getRoleModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.Role.schema(tenant);
};

export const getPermissionModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.Permission.schema(tenant);
};

export const getClientModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.Client.schema(tenant);
};

export const getServiceAddressModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.ServiceAddress.schema(tenant);
};

export const getServiceItemTemplateModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.ServiceItemTemplate.schema(tenant);
};

export const getServiceModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.Service.schema(tenant);
};

export const getServiceItemModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.ServiceItem.schema(tenant);
};

export const getJobModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.Job.schema(tenant);
};

export const getVehicleModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.Vehicle.schema(tenant);
};

export const getEntityModel = () => {
  const tenant = httpContext.get('tenant');

  return Models.Entity.schema(tenant);
};

// Using a defined list of table name will make it more secured
export const getTableName = (tableName: TableNames) => {
  const tenantKey = httpContext.get('tenant');

  switch (tableName) {
    case TableNames.User:
      return 'shared."User"';
    case TableNames.Tenant:
      return 'shared."Tenant"';
    case TableNames.Client:
      return `${tenantKey}."Client"`;
    case TableNames.Job:
      return `${tenantKey}."Job"`;
    case TableNames.Permission:
      return `${tenantKey}."Permission"`;
    case TableNames.Role:
      return `${tenantKey}."Role"`;
    case TableNames.RolePermission:
      return `${tenantKey}."RolePermission"`;
    case TableNames.Service:
      return `${tenantKey}."Service"`;
    case TableNames.ServiceAddress:
      return `${tenantKey}."ServiceAddress"`;
    case TableNames.ServiceItem:
      return `${tenantKey}."ServiceItem"`;
    case TableNames.ServiceItemJob:
      return `${tenantKey}."ServiceItemJob"`;
    case TableNames.ServiceItemTemplate:
      return `${tenantKey}."ServiceItemTemplate"`;
    case TableNames.UserProfile:
      return `${tenantKey}."UserProfile"`;
    case TableNames.UserProfileRole:
      return `${tenantKey}."UserProfileRole"`;
    case TableNames.Vehicle:
      return `${tenantKey}."Vehicle"`;
    case TableNames.Entity:
      return `${tenantKey}."Entity"`;
    default:
      return '';
  }
};
