import { sequelize } from '../../config/database';
import { getTableName } from '../models';
import TableNames from '../enums/TableNames';
import { QueryTypes, Transaction } from 'sequelize';

export const create = (userProfileId: number, roleId: number, transaction: Transaction) => {
  const UserProfileRole = getTableName(TableNames.UserProfileRole);
  const currentDateTime = new Date();

  return sequelize.query(
    `INSERT INTO ${UserProfileRole} ("userProfileId", "roleId", "createdAt", "updatedAt") VALUES ($userProfileId, $roleId, $createdAt, $updatedAt)`,
    {
      type: QueryTypes.INSERT,
      bind: {
        userProfileId,
        roleId,
        createdAt: currentDateTime,
        updatedAt: currentDateTime
      },
      transaction
    }
  );
};

export const update = async (userProfileId: number, roleId: number, transaction: Transaction) => {
  await removeAllByUserProfileId(userProfileId, transaction);
  await create(userProfileId, roleId, transaction);
};

export const removeAllByUserProfileId = (userProfileId: number, transaction: Transaction) => {
  const UserProfileRole = getTableName(TableNames.UserProfileRole);

  return sequelize.query(`DELETE FROM ${UserProfileRole} WHERE "userProfileId" = $userProfileId`, {
    type: QueryTypes.DELETE,
    bind: { userProfileId },
    transaction
  });
};
