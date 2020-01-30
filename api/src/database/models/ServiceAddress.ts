import ModelBase from './ModelBase';
import { DataTypes, Sequelize } from 'sequelize';

export default class ServiceAddress extends ModelBase {
  public id!: number;
  public contactPerson!: string;
  public contactNumber!: string; // to cater for country code
  public secondaryContactPerson?: string;
  public secondaryContactNumber?: string;
  public country!: string;
  public address!: string;
  public postalCode!: string;

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        contactPerson: {
          type: DataTypes.STRING,
          allowNull: false
        },
        contactNumber: {
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
        country: {
          type: DataTypes.STRING,
          allowNull: false
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false
        },
        postalCode: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'ServiceAddress',
        freezeTableName: true,
        comment: 'Client service address',
        timestamps: false
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }
}
