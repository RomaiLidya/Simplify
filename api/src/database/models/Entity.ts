import ModelBase from './ModelBase';
import { DataTypes, Sequelize } from 'sequelize';

export default class Entity extends ModelBase {
  public id!: number;
  public name!: string;
  public address!: string;
  public logo!: string;
  public contactNumber!: string;

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
        address: {
          type: DataTypes.STRING,
          allowNull: false
        },
        logo: {
          type: DataTypes.STRING,
          allowNull: false
        },
        contactNumber: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'Entity',
        freezeTableName: true,
        comment: 'Entity for quick selection. Can be taken catalog.'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }
}
