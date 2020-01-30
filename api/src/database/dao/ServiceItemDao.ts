import { Op, Transaction } from 'sequelize';
import { getServiceItemModel } from '../models';

/** Start the delete query */
export const deleteServiceItemByServiceId = async (ServiceId: number, transaction: Transaction) => {
  const model = getServiceItemModel();

  await model.destroy({ where: { ServiceId: { [Op.in]: ServiceId } }, transaction });
};
/** End of the delete query */
