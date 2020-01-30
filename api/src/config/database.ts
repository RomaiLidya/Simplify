import { Sequelize } from 'sequelize';

import Logger from '../Logger';
import User from '../database/models/User';
import UserProfile from '../database/models/UserProfile';
import Role from '../database/models/Role';
import Permission from '../database/models/Permission';
import { Models } from '../database/typings/Models';
import Client from '../database/models/Client';
import ServiceAddress from '../database/models/ServiceAddress';
import ServiceItemTemplate from '../database/models/ServiceItemTemplate';
import Service from '../database/models/Service';
import ServiceItem from '../database/models/ServiceItem';
import Job from '../database/models/Job';
import Tenant from '../database/models/Tenant';
import Vehicle from '../database/models/Vehicle';
import Entity from '../database/models/Entity';

const { DB_HOST, DB_PORT, DB_SCHEMA, DB_USER, DB_PW, DB_POOL_ACQUIRE, DB_POOL_IDLE, DB_POOL_MAX_CONN, DB_POOL_MIN_CONN, DB_LOG_LEVEL } = process.env;

const LOG = new Logger('sequelize');

/**
 * The same database user is used to access the different tenants / schema
 * This decision is made because
 *  1. User can only access the wrong schema if the data is corrupted or hacked.
 *     The hacker can access all tenants information if the app is compromised
 *  2. Having different connection to the same database is overkilled
 */
export const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PW, {
  dialect: 'postgres',
  host: DB_HOST,
  pool: {
    acquire: +DB_POOL_ACQUIRE,
    idle: +DB_POOL_IDLE,
    max: +DB_POOL_MAX_CONN,
    min: +DB_POOL_MIN_CONN
  },
  port: +DB_PORT,
  timezone: 'Asia/Singapore',
  logging: (msg: string) => {
    LOG.log(DB_LOG_LEVEL, msg);
  }
});

export const models: Models = {
  Tenant: Tenant.initModel(sequelize),
  User: User.initModel(sequelize),
  UserProfile: UserProfile.initModel(sequelize),
  Role: Role.initModel(sequelize),
  Permission: Permission.initModel(sequelize),
  Client: Client.initModel(sequelize),
  ServiceAddress: ServiceAddress.initModel(sequelize),
  ServiceItemTemplate: ServiceItemTemplate.initModel(sequelize),
  Service: Service.initModel(sequelize),
  ServiceItem: ServiceItem.initModel(sequelize),
  Job: Job.initModel(sequelize),
  Vehicle: Vehicle.initModel(sequelize),
  Entity: Entity.initModel(sequelize)
};

Object.keys(models).forEach((key: string) => {
  const model = models[key];

  model.associate(models);
});
