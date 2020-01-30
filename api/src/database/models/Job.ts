import {
  DataTypes,
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  Sequelize
} from 'sequelize';

import ModelBase from './ModelBase';
import { Models } from '../typings/Models';
import UserProfile from './UserProfile';
import ServiceItem from './ServiceItem';
import Vehicle from './Vehicle';
import Service from './ServiceItem';

export enum JobStatus {
  UNASSIGNED = 'UNASSIGNED',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  UNABLE_TO_COMPLETE = 'UNABLE_TO_COMPLETE'
}

export default class Job extends ModelBase {
  public id!: number;
  public jobDate?: Date;
  public startTime?: Date;
  public endTime?: Date;
  public jobStatus!: JobStatus;
  public remarks?: string;
  public readonly assignedBy?: UserProfile;
  public readonly assignees?: UserProfile[];
  public readonly assignedVehicle?: Vehicle;
  public readonly serviceItems?: ServiceItem[];
  public readonly serviceId!: Service;

  // timestamp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Auto generated methods from associations
  public createAssignedBy: BelongsToCreateAssociationMixin<UserProfile>;
  public getAssignedBy: BelongsToGetAssociationMixin<UserProfile>;
  public setAssignedBy: BelongsToSetAssociationMixin<UserProfile, number>;

  public getAssignees!: BelongsToManyGetAssociationsMixin<UserProfile>;
  public addAssignee!: BelongsToManyAddAssociationMixin<UserProfile, number>;
  public addAssignees!: BelongsToManyAddAssociationsMixin<UserProfile, number>;
  public hasAssignee!: BelongsToManyHasAssociationMixin<UserProfile, number>;
  public hasAssignees!: BelongsToManyHasAssociationsMixin<UserProfile, number>;
  public countAssignee!: BelongsToManyCountAssociationsMixin;
  public createAssignee!: BelongsToManyCreateAssociationMixin<UserProfile>;
  public removeAssignee!: BelongsToManyRemoveAssociationMixin<UserProfile, number>;
  public removeAssignees!: BelongsToManyRemoveAssociationsMixin<UserProfile, number>;
  public setAssignees!: BelongsToManySetAssociationsMixin<UserProfile, number>;

  public createAssignedVehicle: BelongsToCreateAssociationMixin<Vehicle>;
  public getAssignedVehicle: BelongsToGetAssociationMixin<Vehicle>;
  public setAssignedVehicle: BelongsToSetAssociationMixin<Vehicle, number>;

  public getServiceItems!: BelongsToManyGetAssociationsMixin<ServiceItem>;
  public addServiceItem!: BelongsToManyAddAssociationMixin<ServiceItem, number>;
  public addServiceItems!: BelongsToManyAddAssociationsMixin<ServiceItem, number>;
  public hasServiceItem!: BelongsToManyHasAssociationMixin<ServiceItem, number>;
  public hasServiceItems!: BelongsToManyHasAssociationsMixin<ServiceItem, number>;
  public countServiceItem!: BelongsToManyCountAssociationsMixin;
  public createServiceItem!: BelongsToManyCreateAssociationMixin<ServiceItem>;
  public removeServiceItem!: BelongsToManyRemoveAssociationMixin<ServiceItem, number>;
  public removeServiceItems!: BelongsToManyRemoveAssociationsMixin<ServiceItem, number>;
  public setServiceItems!: BelongsToManySetAssociationsMixin<ServiceItem, number>;

  public createServiceId: BelongsToCreateAssociationMixin<Service>;
  public getServiceId: BelongsToGetAssociationMixin<Service>;
  public setServiceId: BelongsToSetAssociationMixin<Service, number>;

  public static associations: {
    assignedBy: Association<Job, UserProfile>;
    assignees: Association<Job, UserProfile>;
    assignedVehicle: Association<Job, Vehicle>;
    serviceItems: Association<Job, ServiceItem>;
    serviceId: Association<Job, Service>;
  };

  public static associate(models: Models) {
    Job.belongsTo(models.UserProfile, { foreignKey: 'assginedBy', targetKey: 'id' });
    Job.belongsToMany(models.UserProfile, { through: 'UserProfileJob', timestamps: false, foreignKey: 'jobId' });
    Job.belongsTo(models.Vehicle, { foreignKey: 'assignedVehicle', targetKey: 'id' });
    Job.belongsToMany(models.ServiceItem, { through: 'ServiceItemJob', timestamps: false, foreignKey: 'jobId' });
    Job.belongsTo(models.Service, { foreignKey: 'serviceId', targetKey: 'id', onDelete: 'CASCADE' });
  }

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        jobDate: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        startTime: {
          type: DataTypes.TIME,
          allowNull: true
        },
        endTime: {
          type: DataTypes.TIME,
          allowNull: true
        },
        jobStatus: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'UNASSIGNED'
        },
        remarks: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'Job',
        freezeTableName: true,
        comment: 'A job represent the day when the service is being delivered'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }
}
