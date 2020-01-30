import {
  Sequelize,
  DataTypes,
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize';

import ModelBase from './ModelBase';
import { Models } from '../typings/Models';
import UserProfile from './UserProfile';

export default class Vehicle extends ModelBase {
  public id!: number;
  public model?: string;
  public carplateNumber: string;
  public coeExpiryDate?: Date;
  public readonly employeeInCharge?: UserProfile;
  public vehicleStatus!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Auto generated methods from associations
  public createEmployeeInCharge: BelongsToCreateAssociationMixin<UserProfile>;
  public getEmployeeInCharge: BelongsToGetAssociationMixin<UserProfile>;
  public setEmployeeInCharge: BelongsToSetAssociationMixin<UserProfile, number>;

  public static associations: {
    employeeInCharge: Association<Vehicle, UserProfile>;
  };

  public static associate(models: Models) {
    Vehicle.belongsTo(models.UserProfile, { foreignKey: 'employeeInCharge', targetKey: 'id' });
  }

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        model: {
          type: DataTypes.STRING,
          allowNull: true
        },
        carplateNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        coeExpiryDate: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        vehicleStatus: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'Vehicle',
        freezeTableName: true,
        comment: 'Company vehicles information'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }
}
