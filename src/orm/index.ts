import { Logger } from 'log4js';
import { Inject, Service } from 'typedi';
import { Connection, createConnection, useContainer, ConnectionOptions } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

import { LOGGER } from '@logger';

useContainer(Container);

@Service()
export default class Db {
    @Inject(LOGGER)
    logger: Logger;

    #connection: Connection;

    async start (connectionOpts: ConnectionOptions): Promise<void> {
      this.#connection = await createConnection(connectionOpts);
      this.logger.info('Successfully connected to the database.');
    }

    async stop (): Promise<void> {
      await this.#connection.close();
      this.logger.info('Database connection closed.');
    }
}
