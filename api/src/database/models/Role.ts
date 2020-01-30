import {
  DataTypes,
  Association,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  Sequelize
} from 'sequelize';

import UserProfile from './UserProfile';
import ModelBase from './ModelBase';
import Permission from './Permission';
import { Models } from '../typings/Models';
import { RoleResponseModel } from '../../typings/ResponseFormats';

export default class Role extends ModelBase {
  public id!: number;
  public name!: string;
  public readonly userProfiles?: UserProfile[];
  public readonly permission?: Permission[];

  // timestamp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Auto generated methods from associations
  public getUserProfiles!: BelongsToManyGetAssociationsMixin<UserProfile>;
  public addUserProfile!: BelongsToManyAddAssociationMixin<UserProfile, number>;
  public addUserProfiles!: BelongsToManyAddAssociationsMixin<UserProfile, number>;
  public hasUserProfile!: BelongsToManyHasAssociationMixin<UserProfile, number>;
  public hasUserProfiles!: BelongsToManyHasAssociationsMixin<UserProfile, number>;
  public countUserProfile!: BelongsToManyCountAssociationsMixin;
  public createUserProfile!: BelongsToManyCreateAssociationMixin<UserProfile>;
  public removeUserProfile!: BelongsToManyRemoveAssociationMixin<UserProfile, number>;
  public removeUserProfiles!: BelongsToManyRemoveAssociationsMixin<UserProfile, number>;
  public setUserProfiles!: BelongsToManySetAssociationsMixin<UserProfile, number>;

  // Auto generated methods for Permission
  public getPermissions!: BelongsToManyGetAssociationsMixin<Permission>;
  public addPermission!: BelongsToManyAddAssociationMixin<Permission, number>;
  public addPermissions!: BelongsToManyAddAssociationsMixin<Permission, number>;
  public hasPermission!: BelongsToManyHasAssociationMixin<Permission, number>;
  public hasPermissions!: BelongsToManyHasAssociationsMixin<Permission, number>;
  public countPermission!: BelongsToManyCountAssociationsMixin;
  public createPermission!: BelongsToManyCreateAssociationMixin<Permission>;
  public removePermission!: BelongsToManyRemoveAssociationMixin<Permission, number>;
  public removePermissions!: BelongsToManyRemoveAssociationsMixin<Permission, number>;
  public setPermissions!: BelongsToManySetAssociationsMixin<Permission, number>;

  public static associations: {
    userProfiles: Association<Role, UserProfile>;
    permissions: Association<Role, Permission>;
  };

  public static associate(models: Models) {
    Role.belongsToMany(models.UserProfile, { through: 'UserProfileRole', foreignKey: 'roleId' });
    Role.belongsToMany(models.Permission, { through: 'RolePermission', timestamps: false, foreignKey: 'roleId' });
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
        }
      },
      {
        sequelize,
        tableName: 'Role',
        freezeTableName: true,
        comment: 'User role, which contains a group of permission'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }

  public toResponseFormat(): RoleResponseModel {
    return {
      id: this.id,
      name: this.name
    };
  }
}
