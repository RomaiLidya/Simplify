import User from '../models/User';
import UserProfile from '../models/UserProfile';
import Role from '../models/Role';
import Permission from '../models/Permission';
import ModelBase from '../models/ModelBase';
import Client from '../models/Client';
import ServiceAddress from '../models/ServiceAddress';
import ServiceItemTemplate from '../models/ServiceItemTemplate';
import Service from '../models/Service';
import ServiceItem from '../models/ServiceItem';
import Job from '../models/Job';
import Tenant from '../models/Tenant';
import Vehicle from '../models/Vehicle';
import Entity from '../models/Entity';

export interface Models {
  Tenant: typeof Tenant;
  User: typeof User;
  UserProfile: typeof UserProfile;
  Role: typeof Role;
  Permission: typeof Permission;
  Client: typeof Client;
  ServiceAddress: typeof ServiceAddress;
  ServiceItemTemplate: typeof ServiceItemTemplate;
  Service: typeof Service;
  ServiceItem: typeof ServiceItem;
  Job: typeof Job;
  Vehicle: typeof Vehicle;
  Entity: typeof Entity;
  [key: string]: typeof ModelBase;
}
