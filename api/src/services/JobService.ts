import Logger from '../Logger';
import * as JobDao from '../database/dao/JobDao';
import { JobResponseModel } from '../typings/ResponseFormats';
import JobNotFoundError from '../errors/JobNotFoundError';

const LOG = new Logger('JobService.ts');

export const searchJobsWithPagination = async (
  offset: number,
  limit?: number,
  query?: string,
  contractFlag?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string,
  clientId?: number,
  vehicleId?: number,
  employeId?: number
) => {
  LOG.debug('Searching Services with Pagination');
  const { rows, vehicles, employes } = await JobDao.getPaginated(
    offset,
    limit,
    query,
    contractFlag,
    filterBy,
    startDate,
    endDate,
    clientId,
    employeId,
    vehicleId
  );

  return { rows, vehicles, employes };
};

/** Get detail of service that has been processed */
export const getJobFullDetailsById = async (id: number): Promise<JobResponseModel> => {
  LOG.debug('Getting Service full details from id');

  const job = await JobDao.getJobFullDetailsById(id);

  if (!job) {
    throw new JobNotFoundError(id);
  }

  return job;
  console.log('plii', job);
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
// export const deleteService = async (id: number) => {
//   await JobDao.deleteServiceById(id);
// };
