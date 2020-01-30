import argon2 from 'argon2';
import passwordGenerator from 'generate-password';
import jwt from 'jsonwebtoken';

import Logger from '../Logger';
import passwordValidator from '../config/passwordValidator';
import * as UserDao from '../database/dao/UserDao';
import * as UserProfileDao from '../database/dao/UserProfileDao';
import InvalidNewPasswordError from '../errors/InvalidNewPasswordError';
import User from '../database/models/User';
import { sequelize } from '../config/database';
import * as EmailService from '../services/EmailService';
import { setRequestTenancy } from '../utils';
import UserNotFoundError from '../errors/UserNotFoundError';

const LOG = new Logger('PasswordService.ts');

const verifyNewPassword = async (user: User, newPassword: string): Promise<boolean> => {
  let isValidNewPassword = !(await verifyUserPassword(user, newPassword));

  return isValidNewPassword && passwordValidator.validate(newPassword);
};

/**
 * Generate a random password for reset password and create user
 *
 * @returns string
 */
export const generateRandomPassword = (): string => {
  return passwordGenerator.generate({
    length: 8,
    numbers: true,
    uppercase: true
  });
};

/**
 * Hashes the string with argon2
 *
 * @param password The password to be hashed
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password);
};

/**
 * Verify if password matches the user record
 *
 * @param user The user to be verified against
 * @param inputPassword  The input password to be verified
 */
export const verifyUserPassword = async (user: User, inputPassword: string): Promise<boolean> => {
  return await argon2.verify(user.get('password'), inputPassword);
};

/**
 * Check if the new password is valid before setting it
 *
 * New password is valid if
 *  1. it does not match the last password
 *  2. it fulfils the password policy
 *
 * @param userId The userId of the user changing password
 * @param newPassword  The newly set password
 */
export const changePassword = async (userId: number, newPassword: string): Promise<void> => {
  const user = await UserDao.getById(userId);

  if (!(await verifyNewPassword(user, newPassword))) {
    LOG.warn(`User: ${userId} tried changing to an invalid new password`);
    throw new InvalidNewPasswordError();
  }

  const newHashedPassword = await hashPassword(newPassword);
  await user.update({ password: newHashedPassword });
};

export const forgotPassword = async (loginName: string): Promise<void> => {
  const user = await UserDao.getByLoginName(loginName);

  if (!user) {
    LOG.warn(`User: ${loginName} does not exists`);
    throw new UserNotFoundError(loginName);
  }

  // has to set the request tenancy manually as there is no token
  setRequestTenancy(user.get('TenantKey') as string);

  const userProfile = await UserProfileDao.getById(user.get('id'));
  const displayName = userProfile.get('displayName');
  const email = userProfile.get('email');

  const jwt = await generateResetPasswordJwt(user);

  try {
    await EmailService.sendForgotPasswordEmail(loginName, displayName, email, jwt);
  } catch (err) {
    throw err;
  }
};

export const resetPassword = async (newPassword: string, jwtParam: string): Promise<void> => {
  const jwtValue: JwtVerify = (await jwt.verify(jwtParam, process.env.APP_SECRET)) as JwtVerify;
  const user = await UserDao.getById(jwtValue.id);

  if (!user) {
    LOG.warn(`User: ${user.get('loginName')} does not exists`);
    throw new UserNotFoundError(user.get('loginName'));
  }

  // has to set the request tenancy manually as there is no token
  setRequestTenancy(user.get('TenantKey') as string);

  const userProfile = await UserProfileDao.getById(user.get('id'));
  const displayName = userProfile.get('displayName');
  const email = userProfile.get('email');

  const newHashedPassword = await hashPassword(newPassword);

  const transaction = await sequelize.transaction();

  try {
    await user.update({ password: newHashedPassword }, { transaction });
    await EmailService.sendResetPasswordEmail(email, displayName, newPassword, email);
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

export const generateResetPasswordJwt = (user: User): string => {
  const body = {
    id: user.get('id')
  };

  return jwt.sign(body, process.env.APP_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
};
