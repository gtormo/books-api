import * as dotenv from 'dotenv';
import { Logger } from 'log4js';
import 'reflect-metadata';
import { Container, Inject, Service } from 'typedi';

import Db from '@db/index';
import Environment from '@environment';
import { LOGGER } from '@logger';
import Server from '@server/index';

dotenv.config();

@Service()
class App {
  @Inject()
  environment: Environment;

  @Inject()
  server: Server;

  @Inject()
  db: Db;

  @Inject(LOGGER)
  logger: Logger;

  async start (): Promise<void> {
    await this.db.start(this.environment.envs.database);
    await this.server.start();
  }

  async stop (): Promise<void> {
    await this.db.stop();
    this.logger.info('Service succesfully closed');
  }
}

const app = Container.get(App);
process.on('SIGTERM', async (): Promise<void> => app.stop());
app.start();
