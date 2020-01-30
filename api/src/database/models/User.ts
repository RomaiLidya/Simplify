import {
  DataTypes,
  Sequelize,
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize';

import ModelBase from './ModelBase';
import { Models } from '../typings/Models';
import Tenant from './Tenant';
import UserProfile from './UserProfile';

export default class User extends ModelBase {
  public id!: number;
  public loginName!: string;
  public password!: string;
  public concurrency!: number;
  public active!: boolean;
  public lock!: boolean;
  public invalidLogin!: number;

  public readonly TenantKey!: string;
  public readonly Tenant!: Tenant;
  // USerProfile will not has the mixin method due to existing in different schema
  public readonly userProfile!: UserProfile;

  // Auto generated methods from associations
  public createTenant!: BelongsToCreateAssociationMixin<Tenant>;
  public getTenant!: BelongsToGetAssociationMixin<Tenant>;
  public setTenant!: BelongsToSetAssociationMixin<Tenant, string>;

  public static associations: {
    tenant: Association<User, Tenant>;
    userProfile: Association<User, UserProfile>;
  };

  public static associate(models: Models) {
    User.belongsTo(models.Tenant);
    User.hasOne(models.UserProfile, { sourceKey: 'id', foreignKey: 'id' });
  }

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        loginName: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        concurrency: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        lock: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        invalidLogin: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      },
      {
        sequelize,
        tableName: 'User',
        freezeTableName: true,
        comment: 'User stores all the information required for login',
        timestamps: false
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'shared'
      }
    );

    return this;
  }
}
