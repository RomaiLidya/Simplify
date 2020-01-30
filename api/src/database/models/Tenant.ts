import { DataTypes, Sequelize } from 'sequelize';

import ModelBase from './ModelBase';
import { TenantResponseModel } from '../../typings/ResponseFormats';

export default class Tenant extends ModelBase {
  public key!: string;
  public name!: string;
  public numberOfLicense: number;
  public salesPerson!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        key: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        numberOfLicense: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        salesPerson: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'Tenant',
        freezeTableName: true,
        comment: 'Store tenant information'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'shared'
      }
    );

    return this;
  }

  public toResponseFormat(): TenantResponseModel {
    const { key, name, numberOfLicense, salesPerson } = this;

    return {
      key,
      name,
      numberOfLicense,
      salesPerson
    };
  }
}
