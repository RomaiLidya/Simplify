import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
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
import Service, { DiscountTypes } from './Service';
import { Models } from '../typings/Models';
import Job from './Job';

export enum RecurringPeriod {
  ONCE = 'ONCE',
  EVERY_MONTH = 'EVERY_MONTH',
  EVERY_2_MONTHS = 'EVERY_2_MONTHs',
  EVERY_3_MONTHS = 'EVERY_3_MONTHS',
  EVERY_4_MONTHS = 'EVERY_4_MONTHS',
  EVERY_6_MONTHS = 'EVERY_6_MONTHS',
  EVERY_YEAR = 'EVERY_YEAR'
}

export default class ServiceItem extends ModelBase {
  public id!: number;
  public description!: string;
  public quantity!: number;
  public unitPrice!: number;
  public discountType!: DiscountTypes;
  public discountAmt!: number;
  public totalPrice!: number;
  public recurringPeriod!: RecurringPeriod;
  public readonly service?: Service;
  public readonly jobs?: Job[];

  // timestamp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Auto generated methods from associations
  public createService: BelongsToCreateAssociationMixin<Service>;
  public getService: BelongsToGetAssociationMixin<Service>;
  public setService: BelongsToSetAssociationMixin<Service, number>;

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
    service: Association<ServiceItem, Service>;
    jobs: Association<ServiceItem, Job>;
  };

  public static associate(models: Models) {
    ServiceItem.belongsTo(models.Service, { onDelete: 'CASCADE' });
    ServiceItem.belongsToMany(models.Job, {
      through: 'ServiceItemJob',
      timestamps: false,
      foreignKey: 'serviceItemId'
    });
  }

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false
        },
        quantity: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0
        },
        unitPrice: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0
        },
        discountType: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'NA'
        },
        discountAmt: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0
        },
        totalPrice: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0
        },
        recurringPeriod: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'NONE'
        }
      },
      {
        sequelize,
        tableName: 'ServiceItem',
        freezeTableName: true,
        comment: 'Each line item in a service'
        // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'wellac'
      }
    );

    return this;
  }
}
