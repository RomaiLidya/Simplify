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

import Role from './Role';
import ModelBase from './ModelBase';
import { Models } from '../typings/Models';
import { UserProfileResponseModel } from '../../typings/ResponseFormats';
import Job from './Job';

export default class UserProfile extends ModelBase {
  public readonly id!: number; // This is a foreign key from User.id
  public displayName!: string;
  public email!: string;
  public contactNumber!: string;
  public readonly roles?: Role[];
  public readonly jobs?: Job[];

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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

  public getJobs!: BelongsToManyGetAssociationsMixin<Job>;
  public addJob!: BelongsToManyAddAssociationMixin<Job, number>;
  public addJobs!: BelongsToManyAddAssociationsMixin<Job, number>;
  public hasJob!: BelongsToManyHasAssociationMixin<Job, number>;
  public hasJobs!: BelongsToManyHasAssociationsMixin<Job, number>;
  public countJob!: BelongsToManyCountAssociationsMixin;
  public createJob!: BelongsToManyCreateAssociationMixin<Job>;
  public removeJob!: BelongsToManyRemoveAssociationMixin<Job, number>;
  public removeJobs!: BelongsToManyRemoveAssociationsMixin<Job, number>;
  public setJobs!: BelongsToManySetAssociationsMixin<Job, number>;

  public static associations: {
    roles: Association<UserProfile, Role>;
    jobs: Association<UserProfile, Job>;
  };

  public static associate(models: Models) {
    UserProfile.belongsToMany(models.Role, { through: 'UserProfileRole', foreignKey: 'userProfileId' });
    UserProfile.belongsToMany(models.Job, { through: 'UserProfileJob', timestamps: false, foreignKey: 'userProfileId' });
  }

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        displayName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        contactNumber: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'UserProfile',
        freezeTableName: true,
        comment: 'UserProfile contains User metadata that are not related to log in'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }

  public toResponseFormat(): UserProfileResponseModel {
    const { id, displayName, email, contactNumber } = this;

    return {
      id,
      displayName,
      email,
      contactNumber
    };
  }
}
