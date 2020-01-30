import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import httpContext from 'express-http-context';

// DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
// import { sequelize } from './config/database';

import initPassport from './config/passport';
import morgan from './config/morgan';
import routes from './routes';
import globalErrorHandler, { authenticationFailureHandler } from './globalErrorHandler';
import { addTransactionID } from './middleware/addTransactionID';

class App {
  public app: express.Application;

  public constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.app.set('port', process.env.PORT || 5000);
  }

  private async configureMiddlewares(): Promise<void> {
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(httpContext.middleware);
    this.app.use(addTransactionID);
    this.app.use(passport.initialize());
    this.app.use(routes);
    this.app.use(authenticationFailureHandler);
    this.app.use(globalErrorHandler);

    // Do not log access for testing
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan);
    }

    // DON'T REMOVE COMMAND IF YOU DON'T WANT TO RESYNC/INIT DATABASE
    // sequelize.sync({ force: true });

    initPassport();
  }
}

export default new App().app;
