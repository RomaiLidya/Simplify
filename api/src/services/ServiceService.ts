import Logger from '../Logger';
import * as ServiceDao from '../database/dao/ServiceDao';
import { ServiceResponseModel } from '../typings/ResponseFormats';
import ServiceNotFoundError from '../errors/ServiceNotFoundError';

const LOG = new Logger('ServiceService.ts');

/**
 * Search service with query and optional pagination
 *
 * @param s offset for pagination search
 * @param l limit for pagination search
 * @param q query for searching
 * @param c filter for contract flag (all, active, expiring, expired)
 * @param fb filter by for term (termStart, termEnd)
 * @param sd start date value
 * @param ed end date value
 * @param ci client id value
 * @param ei entity id date value
 *
 * @returns the total counts and the data for current page
 */
export const searchServicesWithPagination = async (
  offset: number,
  limit?: number,
  query?: string,
  contractFlag?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string,
  clientId?: number,
  entityId?: number
) => {
  LOG.debug('Searching Services with Pagination');
  const { rows, count, clients, entities } = await ServiceDao.getPaginated(
    offset,
    limit,
    query,
    contractFlag,
    filterBy,
    startDate,
    endDate,
    clientId,
    entityId
  );

  return { rows, count, clients, entities };
};

/** Get detail of service that has been processed */
export const getServiceFullDetailsById = async (id: number): Promise<ServiceResponseModel> => {
  LOG.debug('Getting Service full details from id');

  const service = await ServiceDao.getServiceFullDetailsById(id);

  if (!service) {
    throw new ServiceNotFoundError(id);
  }

  return service;
  console.log('plii', service);
};

/**
 * To Edit a invoice number in a contract, based on user choose and inputed new contract invoice number
 *
 * @param invoiceNo of the new contract
 *
 * @returns void
 */
export const editInvoiceNumber = async (id: number, invoiceNo: string) => {
  LOG.debug('Editing Invoice Number On Contract');

  const service = await ServiceDao.getServiceById(id);

  if (!service) {
    throw new ServiceNotFoundError(id);
  }

  let invoiceNumber;
  if (invoiceNo === '') {
    invoiceNumber = null;
  } else {
    invoiceNumber = invoiceNo;
  }

  try {
    await service.update({ invoiceNumber });
    return await getServiceFullDetailsById(id);
  } catch (err) {
    throw err;
  }
};

/**
 * To delete service (hard delete)
 *
 * @param id of the service to be deleted
 *
 * @returns void
 */
export const deleteService = async (id: number) => {
  await ServiceDao.deleteServiceById(id);
};
