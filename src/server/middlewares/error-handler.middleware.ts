import express, { Request } from 'express';
import { Logger } from 'log4js';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { LOGGER } from '@logger';

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    @Inject(LOGGER)
    logger: Logger;

    error (err: any, _req: Request, res: express.Response): void {
      this.logger.error(err);

      const errorStatus = err.httpCode || err.status || 500;
      res.status(errorStatus).json({
        error: true,
        code: err.code,
        message: err.message,
        errors: err.errors
      });
    }
}
