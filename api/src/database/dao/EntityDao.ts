import Entity from '../models/Entity';
import { getEntityModel } from '../models';
import { QueryTypes } from 'sequelize';
import TableNames from '../enums/TableNames';
import { EntityResponseModel } from '../../typings/ResponseFormats';
import { sequelize } from '../../config/database';
import { getTableName } from '../models';

export const getPaginated = async (name: string, address?: string, logo?: string, contactNumber?: string) => {
  const [entities] = await Promise.all([get(name, address, logo, contactNumber)]);

  return { entities };
};
export const getEntityFullDetailsById = async (id: number): Promise<EntityResponseModel> => {
  const Entity = getTableName(TableNames.Entity);

  const result: EntityResponseModel[] = await sequelize.query(
    ` SELECT * FROM ${Entity}
    
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

export const get = async (name?: string, address?: string, logo?: string, contactNumber?: string): Promise<EntityResponseModel[]> => {
  const Entity = getTableName(TableNames.Entity);

  const result: EntityResponseModel[] = await sequelize.query(
    ` SELECT * FROM ${Entity}
    
    `,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

export const deleteEntityById = async (id: number) => {
  const model = getEntityModel();

  await model.destroy({ where: { id } });
};

export const createEntity = async (name: string, address: string, logo: string, contactNumber: string) => {
  const model = getEntityModel();

  return model.create<Entity>({
    name,
    address,
    logo,
    contactNumber
  });
