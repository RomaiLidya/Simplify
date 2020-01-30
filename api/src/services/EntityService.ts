import Logger from '../Logger';
import * as EntityDao from '../database/dao/EntityDao';
import { EntityResponseModel } from '../typings/ResponseFormats';
import EntityNotFoundError from '../errors/EntityNotFoundError';

const LOG = new Logger('EntityService.ts');

export const createEntity = async (name: string, address: string, logo: string, contactNumber: string) => {
  LOG.debug('Creating Entity');

  try {
    const entity = await EntityDao.createEntity(name, address, logo, contactNumber);

    return entity;
  } catch (err) {
    console.log('ERROR', err);

    throw err;
  }
};

export const searchEntityWithPagination = async (name?: string, address?: string, logo?: string, contactNumber?: string) => {
  LOG.debug('Searching Services with Pagination');
  const { entities } = await EntityDao.getPaginated(name, address, logo, contactNumber);

  return { entities };
};

/** Get detail of service that has been processed */
export const getJobFullDetailsById = async (id: number): Promise<EntityResponseModel> => {
  LOG.debug('Getting Service full details from id');

  const entity = await EntityDao.getEntityFullDetailsById(id);

  if (!entity) {
    throw new EntityNotFoundError(id);
  }

  return entity;
  console.log('plii', entity);
};

/**
 * To Edit a invoice number in a contract, based on user choose and inputed new contract invoice number
 *
 * @param invoiceNo of the new contract
 *
 * @returns void
//  */
// export const editInvoiceNumber = async (id: number, invoiceNo: string) => {
//   LOG.debug('Editing Invoice Number On Contract');

//   const service = await ServiceDao.getServiceById(id);

//   if (!service) {
//     throw new ServiceNotFoundError(id);
//   }

//   let invoiceNumber;
//   if (invoiceNo === '') {
//     invoiceNumber = null;
//   } else {
//     invoiceNumber = invoiceNo;
//   }

//   try {
//     await service.update({ invoiceNumber });
//     return await getServiceFullDetailsById(id);
//   } catch (err) {
//     throw err;
//   }
// };

/**
 * To delete service (hard delete)
 *
 * @param id of the service to be deleted
 *
 * @returns void
//  */
export const deleteEntity = async (id: number) => {
  await EntityDao.deleteEntityById(id);
};
