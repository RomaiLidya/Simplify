import ModelBase from './ModelBase';
import { DataTypes, Sequelize } from 'sequelize';
import { ServiceItemTemplateResponseModel } from '../../typings/ResponseFormats';

export default class ServiceItemTemplate extends ModelBase {
  public id!: number;
  public name!: string;
  public description?: string;
  public unitPrice!: number;

  // timestamp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
        description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        unitPrice: {
          type: DataTypes.FLOAT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'ServiceItemTemplate',
        freezeTableName: true,
        comment: 'ServiceItem template for quick selection. Can be taken catelog.'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }

  public toResponseFormat(): ServiceItemTemplateResponseModel {
    const { id, name, description, unitPrice } = this;

    return {
      id,
      name,
      description,
      unitPrice
    };
  }
}
