import Logger from '../Logger';
import EmailTransporter from '../config/EmailTransporter';

const LOG = new Logger('EmailService.ts');

/**
 * To send forgot password email
 *
 * @param loginName Login name of the user requested for reset password
 * @param displayName Display name of the user requested for reset password
 * @param toEmail Email address of the recepient
 * @param jwt JWT
 */
export const sendForgotPasswordEmail = async (loginName: string, displayName: string, toEmail: string, jwt: string): Promise<void> => {
  const resetPasswordLink = 'http://localhost:3000/resetpassword?t=' + jwt;
  await EmailTransporter.send({
    template: `forgotPassword`,
    message: {
      to: toEmail
    },
    locals: {
      loginName,
      displayName,
      resetPasswordLink
    }
  });

  LOG.debug('Reset Password Link email sent');
};

/**
 * To send reset password email
 *
 * @param loginName Login name of the user requested for reset password
 * @param displayName Display name of the user requested for reset password
 * @param newPassword The newly reset password
 * @param toEmail Email address of the recepient
 */
export const sendResetPasswordEmail = async (loginName: string, displayName: string, newPassword: string, toEmail: string): Promise<void> => {
  await EmailTransporter.send({
    template: `resetPassword`,
    message: {
      to: toEmail
    },
    locals: {
      loginName,
      displayName,
      newPassword
    }
  });

  LOG.debug('Confirm Reset Password email sent');
};

/**
 * To send new user welcome email
 *
 * @param loginName
 * @param displayName
 * @param newPassword
 * @param toEmail
 */
export const sendNewUserWelcomeEmail = async (loginName: string, displayName: string, newPassword: string, toEmail: string): Promise<void> => {
  await EmailTransporter.send({
    template: `welcome`,
    message: {
      to: toEmail
    },
    locals: {
      loginName,
      displayName,
      newPassword
    }
  });

  LOG.debug('Welcome email sent');
};
