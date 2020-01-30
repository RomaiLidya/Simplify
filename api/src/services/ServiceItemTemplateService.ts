import Logger from '../Logger';
import * as ServiceItemTemplateDao from '../database/dao/ServiceItemTemplateDao';
import ServiceItemTemplateNotFoundError from '../errors/ServiceItemTemplateNotFoundError';
import { ServiceItemTemplateResponseModel } from '../typings/ResponseFormats';

const LOG = new Logger('ServiceItemTemplateService');

/**
 * Search Service Item Template with query and optional pagination
 *
 * @param s offset for pagination search
 * @param l limit for pagination search
 * @param q query for searching
 *
 * @returns the total counts and the data for current page
 */
export const searchServiceItemTemplatesWithPagination = async (offset: number, limit?: number, q?: string) => {
  LOG.debug('Searching Service Item Templates with Pagination');
  return await ServiceItemTemplateDao.getPaginated(offset, limit, q);
};

/**
 * Create a new service item template in the system, based on user input
 *
 * @param name of the new service item template
 * @param description of the new service item template
 * @param unitPrice of the new service item template
 *
 * @returns ServiceItemTemplatesModel
 */
export const createServiceItemTemplate = async (name: string, description: string, unitPrice: number) => {
  LOG.debug('Creating Service Item Template');

  try {
    const serviceItemTemplate = await ServiceItemTemplateDao.createServiceItemTemplate(name, description, unitPrice);

    return serviceItemTemplate;
  } catch (err) {
    throw err;
  }
};

export const getServiceItemTemplateFullDetailsById = async (id: number): Promise<ServiceItemTemplateResponseModel> => {
  LOG.debug('Getting Service Item Template full details from id');

  const serviceItemTemplate = await ServiceItemTemplateDao.getServiceItemTemplateById(id);

  if (!serviceItemTemplate) {
    throw new ServiceItemTemplateNotFoundError(id);
  }

  return serviceItemTemplate.toResponseFormat();
};

/**
 * To Edit a service item template in the system, based on user choose and inputed new data
 *
 * @param id of service item template
 * @param name of the service item template
 * @param description of the service item template
 * @param unitPrice of the service item template
 *
 * @returns void
 */
export const editServiceItemTemplate = async (id: number, name: string, description: string, unitPrice: number) => {
  LOG.debug('Editing Service Item Template');

  const serviceItemTemplate = await ServiceItemTemplateDao.getServiceItemTemplateById(id);

  if (!serviceItemTemplate) {
    throw new ServiceItemTemplateNotFoundError(id);
  }

  try {
    await serviceItemTemplate.update({ name, description, unitPrice });

    return await getServiceItemTemplateFullDetailsById(id);
  } catch (err) {
    throw err;
  }
};

/**
 * To delete service item template (hard delete)
 *
 * @param serviceItemTemplateId of the service item template to be deleted
 *
 * @returns void
 */
export const deleteServiceItemTemplate = async (id: number) => {
  await ServiceItemTemplateDao.deleteServiceItemTemplateById(id);
};
