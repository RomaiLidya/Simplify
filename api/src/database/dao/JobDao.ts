import { QueryTypes } from 'sequelize';
import { format, addDays } from 'date-fns';

import { getTableName, getJobModel } from '../models';
import TableNames from '../enums/TableNames';
import Job from '../models/Job';

import { sequelize } from '../../config/database';
import { JobResponseModel, ParametersResponseModel } from '../../typings/ResponseFormats';

export const getPaginated = async (
  offset: number,
  limit: number,
  query?: string,
  jobFlag?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string,
  clientId?: number,
  employeId?: number,
  vehicleId?: number
) => {
  const [rows, vehicles, employes] = await Promise.all([
    get(offset, limit, query, jobFlag, filterBy, startDate, endDate, clientId, vehicleId, employeId),
    getVehicles(),
    getEmployes()
  ]);

  return { rows, vehicles, employes };
};

/** Start the service search query */
export const get = async (
  offset: number,
  limit: number,
  query?: string,
  jobFlag?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string,
  clientId?: number,
  vehicleId?: number,
  employeId?: number
): Promise<JobResponseModel[]> => {
  const Job = getTableName(TableNames.Job);
  const Service = getTableName(TableNames.Service);
  const Client = getTableName(TableNames.Client);
  const Vehicle = getTableName(TableNames.Vehicle);
  const UserProfile = getTableName(TableNames.UserProfile);
  const where = generateWhereQuery(query, jobFlag, filterBy, startDate, endDate, clientId, employeId, vehicleId);
  const offsetAndLimit = generateOffsetAndLimit(offset, limit);

  const result: JobResponseModel[] = await sequelize.query(
    `SELECT
    j."id" AS "jobId",
    j."startTime" AS "startTime",
    j."endTime" AS "endTime",
    j."jobDate" AS "Datee",


    s."id" AS "serviceId",
    s."serviceType" AS "Type",

    s."ClientId" AS "clientId",
    c."name" AS "clientName",
    c."billingAddress" AS "serviceAddress",
    
    v."id" AS "vehicleId",
    v."carplateNumber" AS "vehicleNo",
    
    u."id" AS "UserProfileId",
    u."displayName" AS "displayName"
      
    
  FROM
    ${Job} as j
    INNER JOIN ${Service} AS s ON j."serviceId" = s."id"
    INNER JOIN ${Client} AS c ON s."ClientId" = c."id"
    INNER JOIN ${Vehicle} AS v ON v."id" = j."assignedVehicle"
    INNER JOIN ${UserProfile} AS u ON v."id" = u."id"
  `,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

const generateWhereQuery = (
  query?: string,
  jobFlag?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string,
  clientId?: number,
  employeId?: number,
  vehicleId?: number
): string => {
  const conditions: string[] = [];

  if (!query && !jobFlag && !filterBy && !clientId && !vehicleId && !employeId) {
    return '';
  }
  console.log(generateWhereQuery);

  if (query) {
    conditions.push(
      `(j."id" ILIKE '%${query}%' 
       OR s.serviceType ILIKE '%${query}%'
        OR to_char(j."jobDate",'dd/MM/yyyy')::text ILIKE '%${query}%'
        OR to_char(j."startTime",'dd/MM/yyyy')::text ILIKE '%${query}%' 
        OR to_char(j."endTime",'dd/MM/yyyy')::text ILIKE '%${query}%')`
    );
  }

  if (jobFlag) {
    if (jobFlag === '1') {
      conditions.push(`j."endTime" >= '${escape(format(new Date(), 'yyyy-MM-dd'))}'`);
    } else if (jobFlag === '2') {
      conditions.push(
        `j."endTime" >= '${escape(format(new Date(), 'yyyy-MM-dd'))}' AND j."endTime" <= '${escape(format(addDays(new Date(), 31), 'yyyy-MM-dd'))}'`
      );
    } else if (jobFlag === '3') {
      conditions.push(`j."endTime" < '${escape(format(new Date(), 'yyyy-MM-dd'))}'`);
    }
  }

  if (filterBy) {
    conditions.push(
      `j."${filterBy}" >= '${escape(format(new Date(startDate), 'yyyy-MM-dd'))}' AND j."${filterBy}" <= '${escape(
        format(new Date(endDate), 'yyyy-MM-dd')
      )}'`
    );
  }

  if (clientId) {
    conditions.push(`j."ClientId" IN (${clientId})`);
  }

  if (vehicleId) {
    conditions.push(`j."VehicleId" IN (${vehicleId})`);
  }
  if (employeId) {
    conditions.push(`j."ContractId" IN (${employeId})`);
  }

  return `WHERE ${conditions.join(' AND ')}`;
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

export const getVehicles = async (): Promise<ParametersResponseModel[]> => {
  const Job = getTableName(TableNames.Job);
  const Vehicle = getTableName(TableNames.Vehicle);

  const result: ParametersResponseModel[] = await sequelize.query(
    `SELECT DISTINCT
        j."assignedVehicle" AS id,
        v."carplateNumber" AS carplateNumber 

      FROM
        ${Job} j
        INNER JOIN ${Vehicle} v ON j."assignedVehicle" = v."id"`,
    {
      type: QueryTypes.SELECT
    }
  );
  return result;
};
export const getEmployes = async (): Promise<ParametersResponseModel[]> => {
  const UserProfile = getTableName(TableNames.UserProfile);
  const Vehicle = getTableName(TableNames.Vehicle);

  const result: ParametersResponseModel[] = await sequelize.query(
    `SELECT       
   
		u."displayName" AS "displayName"
		
      FROM
       ${Vehicle}  AS v
        INNER JOIN ${UserProfile} AS u ON v."id" = u."id"`,
    {
      type: QueryTypes.SELECT
    }
  );
  return result;
};

/** End of service search query */

/** End of service search query */

/** Start the get service by id query */
export const getJobById = (id: number) => {
  const model = getJobModel();

  return model.findByPk<Job>(id);
};
/** End of get service by id query */

/** Start the get service full detail by id query */
export const getJobFullDetailsById = async (id: number): Promise<JobResponseModel> => {
  const Job = getTableName(TableNames.Job);
  const Service = getTableName(TableNames.Service);
  const Client = getTableName(TableNames.Client);
  const Vehicle = getTableName(TableNames.Vehicle);
  const UserProfile = getTableName(TableNames.UserProfile);

  const result: JobResponseModel[] = await sequelize.query(
    `SELECT
    j."id" AS "jobId",
    j."startTime" AS "startTime",
    j."endTime" AS "endTime",
    j."jobDate" AS "Datee",


    s."id" AS "serviceId",
    s."serviceType" AS "Type",

    s."ClientId" AS "clientId",
    c."name" AS "clientName",
    c."billingAddress" AS "serviceAddress",
    
    v."id" AS "vehicleId",
    v."carplateNumber" AS "vehicleNo",
    
    u."id" AS "UserProfileId",
    u."displayName" AS "displayName"
      
    
  FROM
    ${Job} as j
    INNER JOIN ${Service} AS s ON j."serviceId" = s."id"
    INNER JOIN ${Client} AS c ON s."ClientId" = c."id"
    INNER JOIN ${Vehicle} AS v ON v."id" = j."assignedVehicle"
    INNER JOIN ${UserProfile} AS u ON v."id" = u."id"
    
    `,
    {
      type: QueryTypes.SELECT,
      bind: {
        id
      }
    }
  );

  return result[0];
};
/** End of get service full detail by id query */

/** Start the delete query */
// export const deleteServiceById = async (id: number) => {
//   const model = getServiceModel();

//   await model.destroy({ where: { id: { [Op.in]: id } } });
// };
/** End of the delete query */
