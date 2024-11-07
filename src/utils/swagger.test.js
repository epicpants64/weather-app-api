import Joi from 'joi'
import { createSwaggerSchema, getSwaggerSpecification } from './swagger'
import { validSwaggerMethods } from '../constants/validSwaggerMethods'

let mockConfig

describe('Test getSwaggerSpecification', () => {
  beforeEach(() => {
    mockConfig = {
      SWAGGER_SCHEMA_TITLE: 'Test title',
      SWAGGER_SCHEMA_VERSION: '1.0.0',
      SWAGGER_SCHEMA_DESCRIPTION: 'Test description',
      SWAGGER_SCHEMA_SERVERS: 'https://localhost/',
      SWAGGER_SCHEMA_TAGS: 'entry'
    }
  })

  it('Generates a default Swagger Specification', async () => {
    createSwaggerSchema({
      path: '/endpoint',
      description: 'Default Description',
      method: validSwaggerMethods.GET,
      tags: 'entry'
    })

    const getSwaggerSpecificationResponse = getSwaggerSpecification(mockConfig)

    expect(getSwaggerSpecificationResponse).toEqual({
      openapi: '3.0.0',
      info: {
        title: 'Test title',
        description: 'Test description',
        version: '1.0.0'
      },
      servers: [{ url: 'https://localhost/' }],
      tags: [{ name: 'entry' }],
      paths: {}
    })
  })

  it('Generates a default Swagger Specification without servers, tags or authentication', async () => {
    mockConfig.SWAGGER_SCHEMA_TAGS = undefined
    mockConfig.SWAGGER_SCHEMA_SERVERS = undefined

    createSwaggerSchema({
      path: '/endpoint',
      description: 'Default Description',
      method: validSwaggerMethods.GET,
      request: {
        body: {}
      },
      authenticate: false
    })

    const getSwaggerSpecificationResponse = getSwaggerSpecification(mockConfig)

    expect(getSwaggerSpecificationResponse).toEqual({
      openapi: '3.0.0',
      info: {
        title: 'Test title',
        description: 'Test description',
        version: '1.0.0'
      },
      servers: [],
      tags: [],
      paths: {
        '/endpoint': {
          get: {
            description: 'Default Description',
            tags: [],
            responses: {
              200: { description: 'successful operation' },
              400: { description: 'bad request' },
              401: { description: 'unauthorized' },
              404: { description: 'not found' },
              500: { description: 'service level error' }
            },
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {},
                    additionalProperties: false
                  }
                }
              }
            },
            parameters: []
          }
        }
      }
    })
  })

  it('Generates a Swagger Specification with a valid body entry`', async () => {
    const REQUEST_BODY_SCHEMA = Joi.object({ variable: Joi.string() })

    createSwaggerSchema({
      path: '/endpoint',
      description: 'Default Description',
      method: validSwaggerMethods.GET,
      tags: 'entry',
      request: {
        body: REQUEST_BODY_SCHEMA
      }
    })

    const getSwaggerSpecificationResponse = getSwaggerSpecification(mockConfig)

    expect(getSwaggerSpecificationResponse).toEqual({
      openapi: '3.0.0',
      info: {
        title: 'Test title',
        description: 'Test description',
        version: '1.0.0'
      },
      servers: [{ url: 'https://localhost/' }],
      tags: [{ name: 'entry' }],
      paths: {
        '/endpoint': {
          get: {
            description: 'Default Description',
            tags: ['entry'],
            responses: {
              200: { description: 'successful operation' },
              400: { description: 'bad request' },
              401: { description: 'unauthorized' },
              404: { description: 'not found' },
              500: { description: 'service level error' }
            },
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { variable: { type: 'string' } },
                    additionalProperties: false
                  }
                }
              }
            },
            parameters: [],
            settings: undefined
          }
        }
      }
    })
  })

  it('Generates a Swagger Specification with a valid query entry`', async () => {
    const REQUEST_QUERY_SCHEMA = Joi.object({ variable: Joi.string() })

    createSwaggerSchema({
      path: '/endpoint',
      description: 'Default Description',
      method: validSwaggerMethods.GET,
      tags: 'entry',
      request: {
        query: REQUEST_QUERY_SCHEMA
      }
    })

    const getSwaggerSpecificationResponse = getSwaggerSpecification(mockConfig)

    expect(getSwaggerSpecificationResponse).toEqual({
      openapi: '3.0.0',
      info: {
        title: 'Test title',
        description: 'Test description',
        version: '1.0.0'
      },
      servers: [{ url: 'https://localhost/' }],
      tags: [{ name: 'entry' }],
      paths: {
        '/endpoint': {
          get: {
            description: 'Default Description',
            tags: ['entry'],
            responses: {
              200: { description: 'successful operation' },
              400: { description: 'bad request' },
              401: { description: 'unauthorized' },
              404: { description: 'not found' },
              500: { description: 'service level error' }
            },
            parameters: [
              {
                in: 'query',
                name: 'variable',
                required: false,
                description: undefined,
                schema: { type: 'string' }
              }
            ],
            settings: undefined
          }
        }
      }
    })
  })

  it('Generates a Swagger Specification with a params valid entry`', async () => {
    const REQUEST_PARAMS_SCHEMA = Joi.object({ variable: Joi.string() })

    createSwaggerSchema({
      path: '/endpoint',
      description: 'Default Description',
      method: validSwaggerMethods.GET,
      tags: 'entry',
      request: {
        params: REQUEST_PARAMS_SCHEMA
      },
      authenticate: true
    })

    const getSwaggerSpecificationResponse = getSwaggerSpecification(mockConfig)

    expect(getSwaggerSpecificationResponse).toEqual({
      openapi: '3.0.0',
      info: {
        title: 'Test title',
        description: 'Test description',
        version: '1.0.0'
      },
      servers: [{ url: 'https://localhost/' }],
      tags: [{ name: 'entry' }],
      paths: {
        '/endpoint': {
          get: {
            description: 'Default Description',
            tags: ['entry'],
            responses: {
              200: { description: 'successful operation' },
              400: { description: 'bad request' },
              401: { description: 'unauthorized' },
              404: { description: 'not found' },
              500: { description: 'service level error' }
            },
            security: [{ bearerAuthentication: [] }],
            parameters: [
              {
                in: 'path',
                name: 'variable',
                required: false,
                description: undefined,
                schema: { type: 'string' }
              }
            ],
            settings: undefined
          }
        }
      }
    })
  })
})
