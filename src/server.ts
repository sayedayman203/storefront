import { UserRoutes } from './handlers/user.handler';
import { isAuth } from './middlewares/isAuth';
import { createResponse } from './helpers/responseFactory';
import fs from 'fs';
import { join } from 'path';

import createError, { HttpError } from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';

const app = express();

//** config
if (process.env.NODE_ENV === 'production') {
  // limit 100 request every minute for user
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 360,
    })
  );

  // security
  app.use(cors());
  app.use(helmet());

  // api log
  const accessLogStream = fs.createWriteStream(
    join(__dirname, '..', 'logs', 'access.log'),
    { flags: 'a' }
  );
  app.use(
    '/api',
    logger<Request, Response>('combined', {
      stream: accessLogStream,
    })
  );
} else if (process.env.NODE_ENV === 'development') {
  // accept request from any domain
  app.use(
    cors({
      origin: '*',
    })
  );

  // log
  app.use(logger('dev'));
}

// parse request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//** handlers
app.use(isAuth);
UserRoutes(app);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction): void => {
  next(createError(404));
});

// error handler
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: HttpError, _req: Request, res: Response, _next: NextFunction): void => {
    if (process.env.NODE_ENV === 'production') {
      fs.appendFile(
        join(__dirname, 'logs', 'error.log'),
        `${new Date().toISOString()}\n----\n${err}\n\n\n\n`,
        (f) => f
      );
    } else if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    res
      .status(err.status || 500)
      .json(
        createResponse(
          err.status < 500 ? 'fail' : 'error',
          null,
          err.message || 'SERVER_ERROR'
        )
      );
  }
);

export default app;
