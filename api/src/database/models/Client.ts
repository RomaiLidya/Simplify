import ModelBase from './ModelBase';
import ServiceAddress from './ServiceAddress';
import {
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
  Association,
  DataTypes,
  Sequelize
} from 'sequelize';
import { Models } from '../typings/Models';
import { ClientResponseModel } from '../../typings/ResponseFormats';

export enum ClientTypes {
  COMMERCIAL = 'COMMERCIAL',
  RESIDENTIAL = 'RESIDENTIAL'
}

export enum ClientPaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  COMPLETED = 'COMPLETED'
}

export default class Client extends ModelBase {
  public id!: number;
  public name!: string;
  public clientType!: ClientTypes;
  public contactPerson!: string;
  public contactNumber!: string; // to cater for country code
  public contactEmail!: string;
  public secondaryContactPerson?: string;
  public secondaryContactNumber?: string; // to cater for country code
  public secondaryContactEmail?: string;
  public country!: string;
  public billingAddress!: string;
  public billingPostal!: string;
  public needGST!: boolean;
  public paymentStatus!: ClientPaymentStatus;
  public readonly serviceAddresses?: ServiceAddress[];

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Auto generated methods from associations
  public getServiceAddresses!: HasManyGetAssociationsMixin<ServiceAddress>;
  public addServiceAddress!: HasManyAddAssociationMixin<ServiceAddress, number>;
  public addServiceAddresses!: HasManyAddAssociationsMixin<ServiceAddress, number>;
  public countServiceAddress!: HasManyCountAssociationsMixin;
  public createServiceAddress!: HasManyCreateAssociationMixin<ServiceAddress>;
  public hasServiceAddress!: HasManyHasAssociationMixin<ServiceAddress, number>;
  public hasServiceAddresses!: HasManyHasAssociationsMixin<ServiceAddress, number>;
  public removeServiceAddress!: HasManyRemoveAssociationMixin<ServiceAddress, number>;
  public removeServiceAddresses!: HasManyRemoveAssociationsMixin<ServiceAddress, number>;
  public setServiceAddresses!: HasManySetAssociationsMixin<ServiceAddress, number>;

  public static associations: {
    serviceAddresses: Association<Client, ServiceAddress>;
  };

  public static associate(models: Models) {
    Client.hasMany(models.ServiceAddress);
  }

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        clientType: {
          type: DataTypes.STRING,
          allowNull: false
        },
        contactPerson: {
          type: DataTypes.STRING,
          allowNull: false
        },
        contactNumber: {
          type: DataTypes.STRING,
          allowNull: false
        },
        contactEmail: {
          type: DataTypes.STRING,
          allowNull: false
        },
        secondaryContactPerson: {
          type: DataTypes.STRING,
          allowNull: true
        },
        secondaryContactNumber: {
          type: DataTypes.STRING,
          allowNull: true
        },
        secondaryContactEmail: {
          type: DataTypes.STRING,
          allowNull: true
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false
        },
        billingAddress: {
          type: DataTypes.STRING,
          allowNull: false
        },
        billingPostal: {
          type: DataTypes.STRING,
          allowNull: false
        },
        needGST: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        paymentStatus: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: ClientPaymentStatus.PENDING
        }
      },
      {
        sequelize,
        tableName: 'Client',
        freezeTableName: true,
        comment: 'Clients information'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }

  public toResponseFormat(): ClientResponseModel {
    const { id, name, clientType, contactPerson, contactEmail, contactNumber, country, billingAddress } = this;

    return {
      id,
      name,
      clientType,
      contactPerson,
      contactEmail,
      contactNumber,
      country,
      billingAddress
    };
  }
}
