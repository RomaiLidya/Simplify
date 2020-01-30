import {
  Association,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  DataTypes,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  Sequelize
} from 'sequelize';

import ModelBase from './ModelBase';
import Role from './Role';
import { Models } from '../typings/Models';
import { PermissionResponseModel } from '../../typings/ResponseFormats';

export enum Modules {
  ADMINISTRATION = 'ADMINISTRATION',
  USERS = 'USERS',
  ENTITIES = 'ENTITIES',
  CLIENTS = 'CLIENTS',
  CONTRACTS = 'CONTRACTS',
  SERVICES = 'SERVICES',
  SERVICE_ITEM_TEMPLATES = 'SERVICE_ITEM_TEMPLATES',
  VEHICLES = 'VEHICLES',
  JOBS = 'JOBS',
  REPORTS = 'REPORTS'
}

export enum AccessLevels {
  ACCESS = 'ACCESS',
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}

export default class Permission extends ModelBase {
  public id!: number;
  public module!: Modules;
  public accessLevel!: AccessLevels;
  public readonly roles?: Role[];

  // Auto generated methods from associations
  public getRoles!: BelongsToManyGetAssociationsMixin<Role>;
  public addRole!: BelongsToManyAddAssociationMixin<Role, number>;
  public addRoles!: BelongsToManyAddAssociationsMixin<Role, number>;
  public hasRole!: BelongsToManyHasAssociationMixin<Role, number>;
  public hasRoles!: BelongsToManyHasAssociationsMixin<Role, number>;
  public countRole!: BelongsToManyCountAssociationsMixin;
  public createRole!: BelongsToManyCreateAssociationMixin<Role>;
  public removeRole!: BelongsToManyRemoveAssociationMixin<Role, number>;
  public removeRoles!: BelongsToManyRemoveAssociationsMixin<Role, number>;
  public setRoles!: BelongsToManySetAssociationsMixin<Role, number>;

  public static associations: {
    roles: Association<Permission, Role>;
  };

  public static associate(models: Models) {
    Permission.belongsToMany(models.Role, { through: 'RolePermission', timestamps: false, foreignKey: 'permissionId' });
  }

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        module: {
          type: DataTypes.STRING,
          unique: 'UQ_MODULE_ACCESSLEVEL',
          allowNull: false
        },
        accessLevel: {
          type: DataTypes.STRING,
          unique: 'UQ_MODULE_ACCESSLEVEL',
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'Permission',
        freezeTableName: true,
        timestamps: false,
        comment: 'List of Permission for the whole applcation'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }

  public toResponseFormat(): PermissionResponseModel {
    const { module, accessLevel } = this;

    return {
      module,
      accessLevel
    };
  }
}
