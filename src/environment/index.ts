import { join } from 'path';

import { Service } from 'typedi';
import { ConnectionOptions } from 'typeorm';

import { IEnvironment } from '@types';

@Service()
export default class Environment {
  private dbBaseConfig: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [join(__dirname, '/../orm/entity/**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '/../orm/migration/**/*{.ts,.js}')],
    cli: {
      migrationsDir: 'src/orm/migration'
    },
    synchronize: true
  };

  private dbProductionConfig = {
    migrationsRun: true,
    dropSchema: false,
    ...this.dbBaseConfig
  };

  private dbTestConfig = {
    seeds: [join(__dirname, '/seeder/**/*.seeder{.ts,.js}')],
    factories: [join(__dirname, '/factory/**/*.factory{.ts,.js}')],
    migrationsRun: false,
    dropSchema: true,
    ...this.dbBaseConfig
  };

  private seedConfig = {
    seeds: [join(__dirname, '/seeder/**/*.seeder{.ts,.js}')],
    factories: [join(__dirname, '/factory/**/*.factory{.ts,.js}')],
    migrationsRun: true,
    dropSchema: false,
    ...this.dbBaseConfig
  };

  public envs: IEnvironment = {
    server: {
      port: parseInt(process.env.SERVER_PORT as string)
    },
    database: process.env.NODE_ENV === 'test'
      ? this.dbTestConfig
      : process.env.NODE_ENV === 'seed'
        ? this.seedConfig
        : this.dbProductionConfig
  };
}
