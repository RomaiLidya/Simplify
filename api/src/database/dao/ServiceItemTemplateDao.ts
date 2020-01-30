import { Op, cast, col, where as sequelizeWhere } from 'sequelize';

import { getServiceItemTemplateModel } from '../models';
import ServiceItemTemplate from '../models/ServiceItemTemplate';

export const getPaginated = async (offset: number, limit: number, q: string = '') => {
  const model = getServiceItemTemplateModel();

  // eslint-disable-next-line
  const where: any = {};

  if (q) {
    where[Op.or] = {
      name: {
        [Op.iLike]: `%${q}%`
      },
      description: {
        [Op.iLike]: `%${q}%`
      },
      unitPrice: sequelizeWhere(cast(col('unitPrice'), 'TEXT'), { [Op.iLike]: `%${q}%` })
    };
  }

  return model.findAndCountAll<ServiceItemTemplate>({
    where,
    offset,
    limit,
    order: [['name', 'ASC']]
  });
};

export const createServiceItemTemplate = async (name: string, description: string, unitPrice: number) => {
  const model = getServiceItemTemplateModel();

  return model.create<ServiceItemTemplate>({
    name,
    description,
    unitPrice
  });
};

export const getServiceItemTemplateById = (id: number) => {
  const model = getServiceItemTemplateModel();

  return model.findByPk<ServiceItemTemplate>(id);
};

export const deleteServiceItemTemplateById = async (id: number) => {
  const model = getServiceItemTemplateModel();

  await model.destroy({ where: { id } });
};
