import express, { RequestHandler } from 'express';
import { OK } from 'http-status-codes';
import { ValidationChain, body } from 'express-validator';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import ValidationHandler from './ValidationHandler';
import * as PasswordService from '../services/PasswordService';

const PasswordController = express.Router();
const LOG = new Logger('PasswordController.ts');

const changePassValidator: ValidationChain[] = [
  body('newPassword', 'New password must not be empty')
    .not()
    .isEmpty()
];

const changePasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { newPassword } = req.body;

    await PasswordService.changePassword(id, newPassword);

    return res.sendStatus(OK);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const resetPassValidator: ValidationChain[] = [
  body('newPassword', 'New password must not be empty')
    .not()
    .isEmpty()
];

const resetPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const { newPassword, jwtParam } = req.body;

    await PasswordService.resetPassword(newPassword, jwtParam);

    return res.sendStatus(OK);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const forgotPassValidator: ValidationChain[] = [
  body('username', 'User name must not be empty')
    .not()
    .isEmpty()
];

const forgotPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.body;

    await PasswordService.forgotPassword(username);

    return res.sendStatus(OK);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

PasswordController.post('/changepassword', Authentication.AUTHENTICATED, changePassValidator, ValidationHandler, changePasswordHandler);
PasswordController.post('/forgotpassword', forgotPassValidator, ValidationHandler, forgotPasswordHandler);
PasswordController.post('/resetpassword', resetPassValidator, ValidationHandler, resetPasswordHandler);

export default PasswordController;
