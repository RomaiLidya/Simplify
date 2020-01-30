import { QueryTypes } from 'sequelize';

import { getTableName, getVehicleModel } from '../models';
import TableNames from '../enums/TableNames';
import Vehicle from '../models/Vehicle';

import { sequelize } from '../../config/database';
import { VehicleResponseModel } from '../../typings/ResponseFormats';
import VehicleNotFoundError from '../../errors/VehicleNotFoundError';

export const getPaginated = async (offset: number, limit: number, q?: string) => {
  const [count, rows] = await Promise.all([getCount(q), get(offset, limit, q)]);

  return { count, rows };
};

/** Start the vehicle search query */
export const get = async (offset: number, limit: number, q?: string): Promise<VehicleResponseModel[]> => {
  const Vehicle = getTableName(TableNames.Vehicle);
  const UserProfile = getTableName(TableNames.UserProfile);
  const where = generateWhereQuery(q);
  const offsetAndLimit = generateOffsetAndLimit(offset, limit);

  const result: VehicleResponseModel[] = await sequelize.query(
    `SELECT v.id, v.model, v."carplateNumber", v."coeExpiryDate", v."employeeInCharge", v."vehicleStatus", up."displayName"
      FROM ${Vehicle} v
      LEFT JOIN ${UserProfile} up ON v."employeeInCharge" = up.id ${where}
      ORDER BY v."carplateNumber" ${offsetAndLimit}`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

export const getCount = async (q?: string): Promise<number> => {
  const Vehicle = getTableName(TableNames.Vehicle);
  const UserProfile = getTableName(TableNames.UserProfile);
  const where = generateWhereQuery(q);

  const result: CountQueryReturn = await sequelize.query(
    `SELECT count(*)
      FROM ${Vehicle} v
      INNER JOIN ${UserProfile} up ON v."employeeInCharge" = up."id"
          ${where}`,
    {
      type: QueryTypes.SELECT
    }
  );

  return +result[0].count;
};

const generateWhereQuery = (q?: string): string => {
  const conditions: string[] = [];

  if (!q) {
    return '';
  }

  if (q) {
    conditions.push(
      `(v."carplateNumber"::text ILIKE '%${q}%' OR to_char(v."coeExpiryDate",'dd/MM/yyyy')::text ILIKE '%${q}%' OR up."displayName" ILIKE '%${q}%')`
    );
  }

  return `WHERE ${conditions}`;
};

const generateOffsetAndLimit = (offset?: number, limit?: number): string => {
  if (offset === undefined) {
    return '';
  }

  let offsetAndLimit = `OFFSET ${offset}`;

  if (limit !== undefined) {
    offsetAndLimit += ` LIMIT ${limit}`;
  }

  return offsetAndLimit;
};
/** End of vehicle search query */

/** Start the vehicle create query */
export const createVehicle = async (model: string, carplateNumber: string, coeExpiryDate: Date, vehicleStatus: boolean, employeeInCharge: number) => {
  const vehicleModel = getVehicleModel();

  return vehicleModel.create<Vehicle>({
    model,
    carplateNumber,
    coeExpiryDate,
    vehicleStatus,
    employeeInCharge
  });
};
/** End of vehicle create query */

export const countByCarplateNumber = (carplateNumber: string) => {
  const model = getVehicleModel();

  return model.count({ where: { carplateNumber } });
};

export const getVehicleFullDetailsById = async (id: number): Promise<VehicleResponseModel> => {
  const UserProfile = getTableName(TableNames.UserProfile);
  const Vehicle = getTableName(TableNames.Vehicle);

  const result: VehicleResponseModel[] = await sequelize.query(
    `SELECT v.id, v.model, v."carplateNumber", v."coeExpiryDate", v."employeeInCharge", v."vehicleStatus", up."displayName"
      FROM ${Vehicle} v
      LEFT JOIN ${UserProfile} up ON v."employeeInCharge" = up.id WHERE v.id = $id`,
    {
      type: QueryTypes.SELECT,
      bind: {
        id
      }
    }
  );

  if (!result.length) {
    throw new VehicleNotFoundError(id);
  }

  return result[0];
};

export const getVehicleById = (id: number) => {
  const model = getVehicleModel();

  return model.findByPk<Vehicle>(id);
};

export const deleteVehicleById = async (id: number) => {
  const model = getVehicleModel();

  await model.destroy({ where: { id } });
};
