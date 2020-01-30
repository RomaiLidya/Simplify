import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Sequelize
} from 'sequelize';

import ModelBase from './ModelBase';
import Client from './Client';
import { Models } from '../typings/Models';
import ServiceAddress from './ServiceAddress';
import ServiceItem from './ServiceItem';
import Entity from './Entity';

export enum ServiceTypes {
  ADHOC = 'ADHOC',
  CONTRACT = 'CONTRACT'
}

export enum DiscountTypes {
  FIXED = 'FIXED',
  PERCENT = 'PERCENT',
  NA = 'NA'
}

export default class Service extends ModelBase {
  public id!: number;
  public serviceType!: ServiceTypes;
  public serviceNumber!: string;
  public description!: string;
  public termStart!: Date;
  public termEnd!: Date;
  public invoiceNumber?: string;
  public discountType!: DiscountTypes;
  public discountAmt!: number;
  public readonly client?: Client;
  public readonly serviceAddress?: ServiceAddress;
  public readonly entity?: Entity;

  // timestamp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Auto generated methods from associations
  public createClient: BelongsToCreateAssociationMixin<Client>;
  public getClient: BelongsToGetAssociationMixin<Client>;
  public setClient: BelongsToSetAssociationMixin<Client, number>;

  public createServiceAddress: BelongsToCreateAssociationMixin<ServiceAddress>;
  public getServiceAddress: BelongsToGetAssociationMixin<ServiceAddress>;
  public setServiceAddress: BelongsToSetAssociationMixin<ServiceAddress, number>;

  public getServiceItems!: HasManyGetAssociationsMixin<ServiceItem>;
  public addServiceItem!: HasManyAddAssociationMixin<ServiceItem, number>;
  public addServiceItems!: HasManyAddAssociationsMixin<ServiceItem, number>;
  public countServiceItem!: HasManyCountAssociationsMixin;
  public createServiceItem!: HasManyCreateAssociationMixin<ServiceItem>;
  public hasServiceItem!: HasManyHasAssociationMixin<ServiceItem, number>;
  public hasServiceItems!: HasManyHasAssociationsMixin<ServiceItem, number>;
  public removeServiceItem!: HasManyRemoveAssociationMixin<ServiceItem, number>;
  public removeServiceItems!: HasManyRemoveAssociationsMixin<ServiceItem, number>;
  public setServiceItems!: HasManySetAssociationsMixin<ServiceItem, number>;

  public createEntity: BelongsToCreateAssociationMixin<Entity>;
  public getEntity: BelongsToGetAssociationMixin<Entity>;
  public setEntity: BelongsToSetAssociationMixin<Entity, number>;

  public static associations: {
    client: Association<Service, Client>;
    serviceAddress: Association<Service, ServiceAddress>;
    serviceItems: Association<Service, ServiceItem>;
    entity: Association<Service, Entity>;
  };

  public static associate(models: Models) {
    Service.belongsTo(models.Client);
    Service.belongsTo(models.ServiceAddress);
    Service.hasMany(models.ServiceItem, { onDelete: 'CASCADE' });
    Service.belongsTo(models.Entity);
  }

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        serviceType: {
          type: DataTypes.STRING,
          allowNull: false
        },
        serviceNumber: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false
        },
        termStart: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        termEnd: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        invoiceNumber: {
          type: DataTypes.STRING,
          allowNull: true
        },
        discountType: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'NA'
        },
        discountAmt: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0
        }
      },
      {
        sequelize,
        tableName: 'Service',
        freezeTableName: true,
        comment: 'A group of service item. Can be taken as contract'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }
}
