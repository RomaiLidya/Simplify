import { Op, QueryTypes } from 'sequelize';
import { format, addDays } from 'date-fns';

import { getTableName, getServiceModel } from '../models';
import TableNames from '../enums/TableNames';
import Service from '../models/Service';

import { sequelize } from '../../config/database';
import { ServiceResponseModel, ParametersResponseModel } from '../../typings/ResponseFormats';
import ServiceNotFoundError from '../../errors/ServiceNotFoundError';

export const getPaginated = async (
  offset: number,
  limit: number,
  query?: string,
  contractFlag?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string,
  clientId?: number,
  entityId?: number
) => {
  const [count, rows, clients, entities] = await Promise.all([
    getCount(query, contractFlag, filterBy, startDate, endDate, clientId, entityId),
    get(offset, limit, query, contractFlag, filterBy, startDate, endDate, clientId, entityId),
    getClients(),
    getEntities()
  ]);

  return { count, rows, clients, entities };
};

/** Start the service search query */
export const get = async (
  offset: number,
  limit: number,
  query?: string,
  contractFlag?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string,
  clientId?: number,
  entityId?: number
): Promise<ServiceResponseModel[]> => {
  const Job = getTableName(TableNames.Job);
  const Service = getTableName(TableNames.Service);
  const Client = getTableName(TableNames.Client);
  const Entity = getTableName(TableNames.Entity);
  const where = generateWhereQuery(query, contractFlag, filterBy, startDate, endDate, clientId, entityId);
  const offsetAndLimit = generateOffsetAndLimit(offset, limit);

  const result: ServiceResponseModel[] = await sequelize.query(
    `SELECT
      s."id",
      s."serviceNumber" AS "contractId",
      s.description AS "contractTitle",
      s."termStart" AS "startDate",
      s."termEnd" AS "endDate",
      s."createdAt" AS "createdDate",
      s."ClientId" AS "clientId",
      s."invoiceNumber" AS "invoiceNo",
      c."name" AS "clientName",
      COUNT ( DISTINCT ( CASE WHEN j."jobStatus" = 'COMPLETED' THEN 1 END ) ) AS completed,
      COUNT ( DISTINCT ( j."id" ) ) AS "totalJob",
      s."EntityId" AS "entityId",
      e."name" AS "entity",
      SUM ( si."totalPrice" ) AS amount 
    FROM
      ${Service} AS s
      LEFT JOIN ${Job} AS j ON j."serviceId" = s."id"
      INNER JOIN ${Client} AS c ON s."ClientId" = c."id"
      INNER JOIN ${Entity} AS e ON s."EntityId" = e."id"
      INNER JOIN wellac."ServiceItem" AS si ON si."ServiceId" = s."id"
    ${where}
    GROUP BY
      s."id", c."id", e."id"
      ORDER BY s."createdAt" DESC ${offsetAndLimit}`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

export const getCount = async (
  query?: string,
  contractFlag?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string,
  clientId?: number,
  entityId?: number
): Promise<number> => {
  const Service = getTableName(TableNames.Service);
  const Client = getTableName(TableNames.Client);
  const where = generateWhereQuery(query, contractFlag, filterBy, startDate, endDate, clientId, entityId);

  const result: CountQueryReturn = await sequelize.query(
    `SELECT count(*)
    FROM ${Service} s
    INNER JOIN ${Client} c ON s."ClientId" = c.id
        ${where}`,
    {
      type: QueryTypes.SELECT
    }
  );

  return +result[0].count;
};

const generateWhereQuery = (
  query?: string,
  contractFlag?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string,
  clientId?: number,
  entityId?: number
): string => {
  const conditions: string[] = [];

  if (!query && !contractFlag && !filterBy && !clientId && !entityId) {
    return '';
  }

  if (query) {
    conditions.push(
      `(s."serviceNumber" ILIKE '%${query}%' 
        OR s.description ILIKE '%${query}%' 
        OR to_char(s."termStart",'dd/MM/yyyy')::text ILIKE '%${query}%' 
        OR to_char(s."termEnd",'dd/MM/yyyy')::text ILIKE '%${query}%')`
    );
  }

  if (contractFlag) {
    if (contractFlag === '1') {
      conditions.push(`s."termEnd" >= '${escape(format(new Date(), 'yyyy-MM-dd'))}'`);
    } else if (contractFlag === '2') {
      conditions.push(
        `s."termEnd" >= '${escape(format(new Date(), 'yyyy-MM-dd'))}' AND s."termEnd" <= '${escape(format(addDays(new Date(), 31), 'yyyy-MM-dd'))}'`
      );
    } else if (contractFlag === '3') {
      conditions.push(`s."termEnd" < '${escape(format(new Date(), 'yyyy-MM-dd'))}'`);
    }
  }

  if (filterBy) {
    conditions.push(
      `s."${filterBy}" >= '${escape(format(new Date(startDate), 'yyyy-MM-dd'))}' AND s."${filterBy}" <= '${escape(
        format(new Date(endDate), 'yyyy-MM-dd')
      )}'`
    );
  }

  if (clientId) {
    conditions.push(`s."ClientId" IN (${clientId})`);
  }

  if (entityId) {
    conditions.push(`s."EntityId" IN (${entityId})`);
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

export const getClients = async (): Promise<ParametersResponseModel[]> => {
  const Service = getTableName(TableNames.Service);
  const Client = getTableName(TableNames.Client);

  const result: ParametersResponseModel[] = await sequelize.query(
    `SELECT DISTINCT
        s."ClientId" AS id,
        c."name" AS name
      FROM
        ${Service} s
        INNER JOIN ${Client} c ON s."ClientId" = c."id"`,
    {
      type: QueryTypes.SELECT
    }
  );
  return result;
};

export const getEntities = async (): Promise<ParametersResponseModel[]> => {
  const Service = getTableName(TableNames.Service);
  const Entity = getTableName(TableNames.Entity);

  const result: ParametersResponseModel[] = await sequelize.query(
    `SELECT DISTINCT
        s."ClientId" AS id,
        e."name" AS name 
      FROM
        ${Service} s
        INNER JOIN ${Entity} e ON s."ClientId" = e."id"`,
    {
      type: QueryTypes.SELECT
    }
  );
  return result;
};
/** End of service search query */

/** Start the get service by id query */
export const getServiceById = (id: number) => {
  const model = getServiceModel();

  return model.findByPk<Service>(id);
};
/** End of get service by id query */

/** Start the get service full detail by id query */
export const getServiceFullDetailsById = async (id: number): Promise<ServiceResponseModel> => {
  const Job = getTableName(TableNames.Job);
  const Service = getTableName(TableNames.Service);
  const Client = getTableName(TableNames.Client);
  const Entity = getTableName(TableNames.Entity);

  const result: ServiceResponseModel[] = await sequelize.query(
    `SELECT
    s."id",
    s."serviceNumber" AS "contractId",
    s.description AS "contractTitle",
    s."termStart" AS "startDate",
    s."termEnd" AS "endDate",
    s."createdAt" AS "createdDate",
    s."ClientId" AS "clientId",
    s."invoiceNumber" AS "invoiceNo",
    c."name" AS "clientName",
    COUNT ( DISTINCT ( CASE WHEN j."jobStatus" = 'COMPLETED' THEN 1 END ) ) AS completed,
    COUNT ( DISTINCT ( j."id" ) ) AS "totalJob",
    s."EntityId" AS "entityId",
    e."name" AS "entity",
    SUM ( si."totalPrice" ) AS amount 
  FROM
    ${Service} AS s
    LEFT JOIN ${Job} AS j ON j."serviceId" = s."id"
    INNER JOIN ${Client} AS c ON s."ClientId" = c."id"
    INNER JOIN ${Entity} AS e ON s."EntityId" = e."id"
    INNER JOIN wellac."ServiceItem" AS si ON si."ServiceId" = s."id"
  WHERE
    s."id" = $id
  GROUP BY
    s."id", c."id", e."id"`,
    {
      type: QueryTypes.SELECT,
      bind: {
        id
      }
    }
  );

  if (!result.length) {
    throw new ServiceNotFoundError(id);
  }

  return result[0];
};
/** End of get service full detail by id query */

/** Start the delete query */
export const deleteServiceById = async (id: number) => {
  const model = getServiceModel();

  await model.destroy({ where: { id: { [Op.in]: id } } });
};
/** End of the delete query */
