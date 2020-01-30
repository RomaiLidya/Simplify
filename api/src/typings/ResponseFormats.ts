import { Modules, AccessLevels } from '../database/models/Permission';
import { ClientTypes } from '../database/models/Client';

export interface UserProfileResponseModel {
  id: number;
  displayName: string;
  email: string;
  contactNumber: string;
}

export interface UserDetailsResponseModel extends UserProfileResponseModel {
  roleId: number;
  role: string;
  active: boolean;
  lock: boolean;
}

export interface TenantResponseModel {
  key: string;
  name: string;
  numberOfLicense: number;
  salesPerson: string;
}

export interface PermissionResponseModel {
  module: Modules;
  accessLevel: AccessLevels;
}

export interface RoleResponseModel {
  id: number;
  name: string;
}

export interface ClientResponseModel {
  id: number;
  name: string;
  clientType: ClientTypes;
  contactPerson: string;
  contactEmail: string;
  contactNumber: string;
  country: string;
  billingAddress: string;
}

export interface ServiceItemTemplateResponseModel {
  id: number;
  name: string;
  description?: string;
  unitPrice: number;
}

export interface VehicleResponseModel {
  id: number;
  model: string;
  carplateNumber: string;
  coeExpiryDate: Date;
  employeeInCharge: number;
  vehicleStatus: boolean;
  displayName: string;
}
export interface EntityResponseModel {
  id: number;
  name: string;
  address: string;
  logo: string;
  contactNumber: number;
}
export interface ActiveUserResponseModel {
  id: number;
  displayName: string;
}

export interface ServiceResponseModel {
  id: number;
  contractId: string;
  clientId: number;
  clientName: string;
  contractTitle: string;
  startDate: Date;
  endDate: Date;
  createdDate: Date;
  invoiceNo: string;
  amount: number;
  entityId: number;
  entity: string;
  completed: number;
  totalJob: number;
}
export interface JobResponseModel {
  id: number;
  jobId: number;
  clientId: number;
  clientName: string;
  serviceAddress: string;
  createdDate: Date;
  startTime: Date;
  endTime: Date;
  vehicleId: number;
  vehicleNo: string;
  employee: string;
  serviceId: number;
  type: string;
}

export interface ParametersResponseModel {
  name: string;
  id: number;
}
