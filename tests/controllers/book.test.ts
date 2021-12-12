import * as dotenv from 'dotenv';
import { getLogger } from 'log4js';
import supertest, { SuperTest, Test } from 'supertest';
import { Connection, createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

import config from '@db/config';
import { Book } from '@db/entity';
import { BookDto } from '@dtos';
import Environment from '@environment';
import Server from '@server/index';
dotenv.config();

describe('Books API - getAll - [GET] /api/v1/books', () => {
  let request: SuperTest<Test>;
  let dbConnection: Connection;

  beforeAll(async () => {
    useContainer(Container);
    dbConnection = await createConnection((new Environment()).envs.database);

    const server = new Server(getLogger(), new Environment());
    request = supertest(server.getNativeExpressApp());
  });

  afterAll(async () => {
    await dbConnection.close();
  });

  it(`should return ${200} and all the books records`, async () => {
    return request
      .get('/api/v1/books')
      .expect(200)
      .then(({ body }) => {
        body.forEach((value: BookDto) => {
          expect(value.id).not.toBeNull();
          expect(value.title).not.toBeNull();
        });
      });
  });
});
