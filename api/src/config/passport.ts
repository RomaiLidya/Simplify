import passport from 'passport';
import { Strategy as strategyLocal, VerifyFunction } from 'passport-local';
import { Strategy as strategyJwt, VerifyCallback, ExtractJwt } from 'passport-jwt';

import Logger from '../Logger';
import { JwtPayload } from '../typings/jwtPayload';
import * as AuthService from '../services/AuthService';
import { setRequestTenancy } from '../utils';

const LOG = new Logger('passport');

export default (): void => {
  const localVerifyFunction: VerifyFunction = async (username, password, done) => {
    try {
      const user = await AuthService.verifyUserCredentials(username, password);

      // Setting the tenancy so that the database schema is correct
      setRequestTenancy(user.get('TenantKey') as string);

      return done(null, user, { message: 'Logged in successfully' });
    } catch (err) {
      LOG.error(err);
      return done(err, false);
    }
  };

  const jwtVerifyFunction: VerifyCallback = async (payload: JwtPayload, done) => {
    try {
      const isValidSession = await AuthService.checkIfValidSession(payload.id, payload.jti);

      if (!isValidSession) {
        LOG.warn(`User ID: ${payload.id}'s token is not whitelisted`);
        return done(false, null);
      }

      // Setting the tenancy so that the database schema is correct
      setRequestTenancy(payload.tenant);

      return done(false, payload);
    } catch (err) {
      LOG.error(err);
      return done(err, false);
    }
  };

  const jwtStrategy = new strategyJwt(
    {
      secretOrKey: process.env.APP_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    jwtVerifyFunction
  );

  const localStrategy = new strategyLocal(
    {
      session: false,
      usernameField: 'username',
      passwordField: 'password'
    },
    localVerifyFunction
  );

  passport.use('local', localStrategy);
  passport.use('jwt', jwtStrategy);
};

export const Authentication = {
  TO_AUTHENTICATE: passport.authenticate('local', { session: false, failWithError: true }),
  AUTHENTICATED: passport.authenticate('jwt', { session: false, failWithError: true })
};
