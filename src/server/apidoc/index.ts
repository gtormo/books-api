import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { OpenAPIObject } from 'openapi3-ts';
import { getMetadataArgsStorage, RoutingControllersOptions } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

export const getApiDoc = (routingControllersOptions: RoutingControllersOptions): OpenAPIObject => {
  const { defaultMetadataStorage } = require('class-transformer/cjs/storage');
  const schemas = validationMetadatasToSchemas({ refPointerPrefix: '#/components/schemas/', classTransformerMetadataStorage: defaultMetadataStorage });

  const openapidoc: Partial<OpenAPIObject> = {
    openapi: '3.0.1',
    info: {
      title: 'Books API',
      description: 'Books API',
      version: '1.0.0'
    },
    servers: [{ url: `http://localhost:${process.env.SERVER_PORT}`, description: 'API version 1' }],
    components: {
      schemas
    },
    security: [
      {
        OpenId: ['profile']
      }
    ]
  };

  const storage = getMetadataArgsStorage();
  return routingControllersToSpec(storage, routingControllersOptions, openapidoc);
};
