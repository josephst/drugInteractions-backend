import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import { config, dbOptions } from './config/config';
import { IExpressErr } from './global.d';

import { router as api } from './routes/apiV1/index';
import { router as index } from './routes/index';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    mongoose.connect(`${config.dbPath}`, dbOptions);
    this.middlewear();
    this.routes();
  }

  private middlewear(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json({ limit: '500kb' }));
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
  }

  private routes(): void {
    this.express.use('/', index);
    this.express.use('/apiV1', api);

    // 404s and errors
    // catch 404 and forward to error handler
    this.express.use((req, res, next) => {
      const err = new Error('Not Found') as IExpressErr;
      err.status = 404;
      next(err);
    });
    // error handler
    this.express.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }
}

export { App };
