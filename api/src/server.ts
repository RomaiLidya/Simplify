import errorHandler from 'errorhandler';

import app from './app';
import Logger from './Logger';

const LOG = new Logger('server.ts');
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Error Handler. Provides full stack - remove for production
 */
if (!isProduction) {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  LOG.info('App is initialised');
});

export default server;
