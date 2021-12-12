import { writeFileSync } from 'fs';
import { join } from 'path';

import express, { Express, json, urlencoded } from 'express';
import helmet from 'helmet';
import { Logger } from 'log4js';
import { RoutingControllersOptions, useExpressServer, useContainer } from 'routing-controllers';
import { serve as swaggerUiServe, setup as swaggerUiSetup } from 'swagger-ui-express';
import { Service, Container, Inject } from 'typedi';

import { CustomErrorHandler } from './middlewares/error-handler.middleware';

import Environment from '@environment';
import { LOGGER } from '@logger';
import { getApiDoc } from '@server/apidoc';

useContainer(Container);

@Service()
export default class Server {
    logger: Logger;
    environment: Environment;

    private port: number;
    private app: Express;

    constructor (
      @Inject(LOGGER) logger: Logger,
      @Inject() environment: Environment
    ) {
      this.logger = logger;
      this.environment = environment;
      this.app = express();
      this.port = this.environment.envs.server.port;

      this.app.use(helmet());
      this.app.use(urlencoded({ extended: true }));
      this.app.use(json());

      const routingControllersOptions: RoutingControllersOptions = {
        cors: true,
        validation: true,
        defaultErrorHandler: false,
        controllers: [join(__dirname, '../controllers/*.controller{.ts,.js}')],
        middlewares: [CustomErrorHandler]
      };

      useExpressServer(this.app, routingControllersOptions);
      const spec = getApiDoc(routingControllersOptions);

      if (process.env.NODE_ENV === 'development') {
        try {
          writeFileSync(join(process.cwd(), 'apidoc.json'), JSON.stringify(spec, null, 2));
        } catch (error: any) {
          this.logger.error(`Error saving openapi spec: ${error}`);
        }
      }

      this.app.use('/__/apidoc', swaggerUiServe, swaggerUiSetup(spec));
    }

    getNativeExpressApp = (): Express => this.app;

    #listen (): Promise<void> {
      return new Promise((resolve, reject) => {
        try {
          this.app.listen(this.port, () => {
            this.logger.info(`Server listening at port ${this.port}.`);
            return resolve();
          });
        } catch (error: any) {
          this.logger.error(`Error listening at port ${this.port}: ${error}`);
          return reject(error);
        }
      });
    }

    start = async (): Promise<void> => await this.#listen();
}
