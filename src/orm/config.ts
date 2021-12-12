import { join } from 'path';

import { getLogger } from 'log4js';
import { ConnectionOptions } from 'typeorm';

const baseConfig = {
  type: 'postgres',
  host: process.env.API_DATABASE_SERVER,
  port: 5432,
  username: process.env.API_DATABASE_USERNAME,
  password: process.env.API_DATABASE_PASSWORD,
  database: process.env.API_DATABASE_NAME,
  entities: [join(__dirname, '/entity/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migration/**/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/orm/migration'
  },
  synchronize: false
} as ConnectionOptions;

const productionConfig = {
  migrationsRun: true,
  dropSchema: false,
  logger: getLogger(),
  ...baseConfig
};

const testConfig = {
  seeds: [join(__dirname, '/seeder/**/*.seeder{.ts,.js}')],
  factories: [join(__dirname, '/factory/**/*.factory{.ts,.js}')],
  migrationsRun: false,
  dropSchema: true,
  ...baseConfig
};

const seedConfig = {
  seeds: [join(__dirname, '/seeder/**/*.seeder{.ts,.js}')],
  factories: [join(__dirname, '/factory/**/*.factory{.ts,.js}')],
  migrationsRun: true,
  dropSchema: false,
  ...baseConfig
};

export default process.env.NODE_ENV === 'test'
  ? testConfig
  : process.env.NODE_ENV === 'seed'
    ? seedConfig
    : productionConfig;
