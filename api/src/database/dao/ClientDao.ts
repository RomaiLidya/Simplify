import { Op } from 'sequelize';

import Client, { ClientTypes } from '../models/Client';
import { getClientModel } from '../models';

export const getPaginated = async (offset?: number, limit?: number, q: string = '', type?: ClientTypes) => {
  const model = getClientModel();

  // eslint-disable-next-line
  const where: any = {
    [Op.and]: {}
  };

  if (q) {
    where[Op.and] = {
      [Op.or]: {
        name: {
          [Op.iLike]: `%${q}%`
        },
        contactNumber: {
          [Op.iLike]: `%${q}%`
        },
        billingAddress: {
          [Op.iLike]: `%${q}%`
        }
      }
    };
  }

  if (type) {
    where[Op.and].clientType = type;
  }

  return model.findAndCountAll<Client>({
    where,
    limit,
    offset
  });
};

export const getById = async (id: number) => {
  const model = getClientModel();

  return model.findByPk<Client>(id);
};

export const createClient = async (
  name: string,
  clientType: string,
  contactPerson: string,
  contactNumber: string,
  contactEmail: string,
  secondaryContactPerson: string,
  secondaryContactNumber: string,
  secondaryContactEmail: string,
  country: string,
  billingAddress: string,
  billingPostal: string,
  needGST: boolean,
  paymentStatus: string
) => {
  const model = getClientModel();

  return model.create<Client>({
    name,
    clientType,
    contactPerson,
    contactNumber,
    contactEmail,
    secondaryContactPerson,
    secondaryContactNumber,
    secondaryContactEmail,
    country,
    billingAddress,
    billingPostal,
    needGST,
    paymentStatus
  });
};
