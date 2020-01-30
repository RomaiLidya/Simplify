import Logger from '../Logger';
import * as VehicleDao from '../database/dao/VehicleDao';
import { VehicleResponseModel } from '../typings/ResponseFormats';
import VehicleNotFoundError from '../errors/VehicleNotFoundError';
import DuplicatedCarplateNumberError from '../errors/DuplicatedCarplateNumberError';

const LOG = new Logger('VehicleService.ts');

/**
 * Search vehicle with query and optional pagination
 *
 * @param s offset for pagination search
 * @param l limit for pagination search
 * @param q query for searching
 *
 * @returns the total counts and the data for current page
 */
export const searchVehiclesWithPagination = async (offset: number, limit?: number, q?: string) => {
  LOG.debug('Searching Vehicles with Pagination');
  const { rows, count } = await VehicleDao.getPaginated(offset, limit, q);

  return { rows, count };
};

/**
 * Check if a carplate number exists
 *
 * @param carplateNumber of the required vehicle
 *
 * @returns boolean
 */
export const isVehicleExistsByCarplateNumber = async (carplateNumber: string): Promise<boolean> => {
  return (await VehicleDao.countByCarplateNumber(carplateNumber)) > 0;
};

/** Get detail of vehicle that has been processed */
export const getVehicleFullDetailsById = async (id: number): Promise<VehicleResponseModel> => {
  LOG.debug('Getting Vehicle full details from id');

  const vehicle = await VehicleDao.getVehicleFullDetailsById(id);

  if (!vehicle) {
    throw new VehicleNotFoundError(id);
  }

  return vehicle;
};

/**
 * Create a new vehicle in the system, based on user input
 *
 * @param model of the new vehicle
 * @param carplateNumber of the new vehicle
 * @param coeExpiryDate of the new vehicle
 * @param vehicleStatus of the new vehicle
 * @param employeeInCharge of the new vehicle
 *
 * @returns VehiclesModel
 */
export const createVehicle = async (model: string, carplateNumber: string, coeExpiryDate: Date, vehicleStatus: boolean, employeeInCharge: number) => {
  LOG.debug('Creating Vehicle');

  if (await isVehicleExistsByCarplateNumber(carplateNumber)) {
    throw new DuplicatedCarplateNumberError();
  }

  try {
    const vehicle = await VehicleDao.createVehicle(model, carplateNumber, coeExpiryDate, vehicleStatus, employeeInCharge);
    return await getVehicleFullDetailsById(vehicle.id);
  } catch (err) {
    throw err;
  }
};

/**
 * To Edit a vehicle in the system, based on user choose and inputed new data
 *
 * @param model of the new vehicle
 * @param carplateNumber of the new vehicle
 * @param coeExpiryDate of the new vehicle
 * @param vehicleStatus of the new vehicle
 * @param employeeInCharge of the new vehicle
 *
 * @returns void
 */
export const editVehicle = async (
  id: number,
  model: string,
  carplateNumber: string,
  coeExpiryDate: Date,
  vehicleStatus: boolean,
  employeeInCharge: number
) => {
  LOG.debug('Editing Vehicle');

  const vehicle = await VehicleDao.getVehicleById(id);

  if (!vehicle) {
    throw new VehicleNotFoundError(id);
  }

  try {
    await vehicle.update({ model, carplateNumber, coeExpiryDate, vehicleStatus, employeeInCharge });

    return await getVehicleFullDetailsById(id);
  } catch (err) {
    throw err;
  }
};

/**
 * To activate (set to active) a vehicle
 *
 * @param id of the vehicle to be activated.
 *
 * @returns void
 */
export const activateVehicle = async (id: number) => {
  const vehicle = await VehicleDao.getVehicleById(id);

  if (!vehicle) {
    throw new VehicleNotFoundError(id);
  }
  await vehicle.update({ vehicleStatus: true });
};

/**
 * To deactivate (set to not active) a vehicle
 *
 * @param id of the vehicle to be activated.
 *
 * @returns void
 */
export const deactivateVehicle = async (id: number) => {
  const vehicle = await VehicleDao.getVehicleById(id);

  if (!vehicle) {
    throw new VehicleNotFoundError(id);
  }
  await vehicle.update({ vehicleStatus: false });
};

/**
 * To delete vehicle (hard delete)
 *
 * @param id of the vehicle to be deleted
 *
 * @returns void
 */
export const deleteVehicle = async (id: number) => {
  await VehicleDao.deleteVehicleById(id);
};
