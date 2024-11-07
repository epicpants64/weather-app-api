import j2s from 'joi-to-swagger'

/**
 * Swagger Specifications
 * @param {*} config
 * @returns object
 */
const swaggerSpecification = (config) => {
  const { SWAGGER_SCHEMA_TITLE, SWAGGER_SCHEMA_VERSION, SWAGGER_SCHEMA_DESCRIPTION, SWAGGER_SCHEMA_SERVERS, SWAGGER_SCHEMA_TAGS } = config
  const serversArray = SWAGGER_SCHEMA_SERVERS?.split(',') ?? []
  const serversObject = serversArray.map((endpoint) => {
    return { url: endpoint }
  })

  const tagsArray = SWAGGER_SCHEMA_TAGS?.split(',') ?? []
  const tagsObject = tagsArray.map((tag) => {
    return { name: tag }
  })

  return {
    openapi: '3.0.0',
    info: {
      title: SWAGGER_SCHEMA_TITLE,
      description: SWAGGER_SCHEMA_DESCRIPTION,
      version: SWAGGER_SCHEMA_VERSION
    },
    servers: serversObject,
    tags: tagsObject
  }
}

/**
 * iterateSwaggerSchema
 * @param {object} swagger
 * @param {string} requestType
 * @returns object
 */
const iterateSwaggerSchema = (swagger, requestType) => {
  const { properties, required = [] } = swagger

  return Object.entries(properties).map(([name, schema]) => {
    const { description, ...remainingSchema } = schema

    return {
      in: requestType,
      name,
      required: required.includes(name),
      description,
      schema: remainingSchema
    }
  })
}

/**
 * getRequestBody
 * @param {object} request
 * @returns object
 */
const getRequestBody = (request) => {
  const { body } = request

  if (!body) return undefined

  const { swagger: swaggerBodySchema } = j2s(body)

  return {
    required: true,
    content: {
      'application/json': {
        schema: swaggerBodySchema
      }
    }
  }
}

/**
 * getRequestparameters
 * @param {object} request
 * @returns object[]
 */
const getRequestparameters = (request) => {
  const { params, query } = request
  const parameters = []

  if (params) {
    const { swagger } = j2s(params)
    const swaggerParamsSchema = iterateSwaggerSchema(swagger, 'path')

    parameters.push(...swaggerParamsSchema)
  }

  if (query) {
    const { swagger } = j2s(query)
    const swaggerQuerySchema = iterateSwaggerSchema(swagger, 'query')

    parameters.push(...swaggerQuerySchema)
  }
  return parameters
}

/**
 * @var {object} swaggerSpecMethodDefaults
 */
const swaggerSpecMethodDefaults = {
  responses: {
    200: {
      description: 'successful operation'
    },
    400: {
      description: 'bad request'
    },
    404: {
      description: 'not found'
    },
    401: {
      description: 'unauthorized'
    },
    500: {
      description: 'service level error'
    }
  }
}

/**
 * @var {object} swaggerSpecificationPaths
 */
const swaggerSpecificationPaths = {}

/**
 * getSwaggerSpecification
 * @param {object} config
 * @returns object
 */
export const getSwaggerSpecification = (config) => {
  return {
    ...swaggerSpecification(config),
    paths: { ...swaggerSpecificationPaths }
  }
}

/**
 * createSwaggerSchema
 * @param {object} options
 * @returns true | false
 */
export const createSwaggerSchema = (options) => {
  const { path, method, description, authenticate = false, tags, settings, request } = options

  if (!path || !method || !request) return false

  const requestBody = getRequestBody(request)
  const parameters = getRequestparameters(request)

  const tagsArray = tags?.split(',') ?? []

  let security

  if (authenticate) {
    security = [
      {
        bearerAuthentication: []
      }
    ]
  }

  swaggerSpecificationPaths[path] = {
    [method]: {
      description,
      tags: tagsArray,
      ...swaggerSpecMethodDefaults,
      requestBody,
      parameters,
      security,
      settings
    }
  }
  return true
}
