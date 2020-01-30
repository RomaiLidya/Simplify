import { Transaction, QueryTypes } from 'sequelize';

import { getUserProfileModel, getTableName } from '../models';
import User from '../models/User';
import TableNames from '../enums/TableNames';
import { sequelize } from '../../config/database';
import { UserDetailsResponseModel, ActiveUserResponseModel } from '../../typings/ResponseFormats';
import UserNotFoundError from '../../errors/UserNotFoundError';
import UserProfile from '../models/UserProfile';

export const createUserProfile = (user: User, displayName: string, contactNumber: string, transaction: Transaction) => {
  const model = getUserProfileModel();

  return model.create<UserProfile>(
    {
      id: user.get('id'),
      displayName,
      email: user.get('loginName'),
      contactNumber
    },
    { transaction }
  );
};

export const getById = (id: number) => {
  const model = getUserProfileModel();

  return model.findByPk<UserProfile>(id);
};

export const getPaginated = async (offset: number, limit: number, q?: string, role?: string) => {
  const [count, rows] = await Promise.all([getCount(q, role), get(offset, limit, q, role)]);

  return { count, rows };
};

export const getUserFullDetails = async (userId: number): Promise<UserDetailsResponseModel> => {
  const User = getTableName(TableNames.User);
  const UserProfile = getTableName(TableNames.UserProfile);
  const UserProfileRole = getTableName(TableNames.UserProfileRole);
  const Role = getTableName(TableNames.Role);

  const result: UserDetailsResponseModel[] = await sequelize.query(
    `SELECT u.id, u.active, u.lock, up."displayName", up.email, up."contactNumber", r."name" as role, r.id as "roleId"
    FROM ${User} u
      INNER JOIN ${UserProfile} up ON u.id = up.id
      INNER JOIN ${UserProfileRole} upr ON up.id = upr."userProfileId"
      INNER JOIN ${Role} r ON upr."roleId" = r.id WHERE up.id = $userId`,
    {
      type: QueryTypes.SELECT,
      bind: {
        userId
      }
    }
  );

  if (!result.length) {
    throw new UserNotFoundError(userId);
  }

  return result[0];
};

export const get = async (offset: number, limit: number, q?: string, role?: string): Promise<UserDetailsResponseModel[]> => {
  const User = getTableName(TableNames.User);
  const UserProfile = getTableName(TableNames.UserProfile);
  const UserProfileRole = getTableName(TableNames.UserProfileRole);
  const Role = getTableName(TableNames.Role);
  const where = generateWhereQuery(q, role);
  const offsetAndLimit = generateOffsetAndLimit(offset, limit);

  const result: UserDetailsResponseModel[] = await sequelize.query(
    `SELECT u.id, u.active, u.lock, up."displayName", up.email, up."contactNumber", r."name" as role, r.id as "roleId"
      FROM ${User} u
        INNER JOIN ${UserProfile} up ON u.id = up.id
        INNER JOIN ${UserProfileRole} upr ON up.id = upr."userProfileId"
        INNER JOIN ${Role} r ON upr."roleId" = r.id ${where} ORDER BY up."displayName" ${offsetAndLimit}`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

export const getCount = async (q?: string, role?: string): Promise<number> => {
  const UserProfile = getTableName(TableNames.UserProfile);
  const UserProfileRole = getTableName(TableNames.UserProfileRole);
  const where = generateWhereQuery(q, role);

  const result: CountQueryReturn = await sequelize.query(
    `SELECT count(*)
      FROM ${UserProfile} up
        INNER JOIN ${UserProfileRole} upr ON up.id = upr."userProfileId"
      ${where}`,
    {
      type: QueryTypes.SELECT
    }
  );

  return +result[0].count;
};

const generateWhereQuery = (q?: string, role?: string): string => {
  const conditions: string[] = [];

  if (!q && !role) {
    return '';
  }

  if (q) {
    conditions.push(`(up."displayName" ILIKE '%${q}%' OR up."email" ILIKE '%${q}%')`);
  }

  if (role) {
    conditions.push(`upr."roleId" = ${escape(role)}`);
  }

  return `WHERE ${conditions.join(' AND ')}`;
};

const generateOffsetAndLimit = (offset?: number, limit?: number): string => {
  if (offset === undefined) {
    return '';
  }

  let offsetAndLimit = `OFFSET ${offset}`;

  if (limit !== undefined) {
    offsetAndLimit += ` LIMIT ${limit}`;
  }

  return offsetAndLimit;
};

export const getActiveUsers = async (): Promise<ActiveUserResponseModel[]> => {
  const User = getTableName(TableNames.User);
  const UserProfile = getTableName(TableNames.UserProfile);

  const result: ActiveUserResponseModel[] = await sequelize.query(
    `SELECT up.id, up."displayName"
        FROM ${UserProfile} up
        INNER JOIN ${User} u ON up.id = u.id
        WHERE u.active = true
        ORDER BY up."displayName"`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};
