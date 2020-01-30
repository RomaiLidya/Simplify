import Logger from '../Logger';
import * as ClientDao from '../database/dao/ClientDao';
import Client from '../database/models/Client';
import { ClientTypes } from '../database/models/Client';
import ClientNotFoundError from '../errors/ClientNotFoundError';

const LOG = new Logger('ClientService');

export const searchClientsWithPagination = async (offset: number, limit?: number, q?: string, type?: ClientTypes) => {
  return await ClientDao.getPaginated(offset, limit, q, type);
};

export const getClientById = async (clientId: number): Promise<Client> => {
  LOG.debug('Getting Client from clientId');

  return await ClientDao.getById(clientId);
};

/**
 * Create a new client in the system, based on user input
 *
 * @param name of the new client
 * @param clientType of the client
 * @param contactPerson of the client
 * @param contactNumber of the client
 * @param contactEmail of the client
 * @param secondaryContactPerson of the client
 * @param secondaryContactNumber of the client
 * @param secondaryContactEmail of the client
 * @param country of the client
 * @param billingAddress of the client
 * @param billingPostal of the client
 * @param needGST of the client
 * @param paymentStatus of the client
 *
 * @returns ClientModel
 */
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
  LOG.debug('Creating Client');

  try {
    const client = await ClientDao.createClient(
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
    );

    return client;
  } catch (err) {
    throw err;
  }
};

/**
 * To Edit client in the system, based on user input
 *
 * @param name of the new client
 * @param clientType of the client
 * @param contactPerson of the client
 * @param contactNumber of the client
 * @param contactEmail of the client
 * @param secondaryContactPerson of the client
 * @param secondaryContactNumber of the client
 * @param secondaryContactEmail of the client
 * @param country of the client
 * @param billingAddress of the client
 * @param billingPostal of the client
 * @param needGST of the client
 * @param paymentStatus of the client
 *
 * @returns void
 */

export const editClient = async (
  id: number,
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
  LOG.debug('Editing Client');

  const client = await ClientDao.getById(id);

  if (!client) {
    throw new ClientNotFoundError(id);
  }

  try {
    await client.update({
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

    return await getClientById(id);
  } catch (err) {
    throw err;
  }
};
