import { intializeContainer } from './container.js'

// process.env is big and would only get bigger better practive to just use what you need instead of spreading all of process.env for config
const {
  LOG_NAME,
  LOG_LEVEL,
  REDIS_HOST,
  REDIS_PORT,
  ENABLE_SWAGGER,
  SWAGGER_SCHEMA_TITLE,
  SWAGGER_SCHEMA_VERSION,
  SWAGGER_SCHEMA_DESCRIPTION,
  SWAGGER_SCHEMA_SERVERS,
  SWAGGER_SCHEMA_TAGS,
  LOCATION_SERVICE_API_KEY,
  LOCATION_SERVICE_BASE_URL,
  FORECAST_SERVICE_API_KEY,
  FORECAST_SERVICE_BASE_URL,
  DB_TIMEOUT,
  DB_URL,
  AUTH_SECRET_KEY,
  PORT
} = process.env

const container = intializeContainer({
  config: {
    LOG_NAME,
    LOG_LEVEL,
    REDIS_HOST,
    REDIS_PORT,
    ENABLE_SWAGGER,
    SWAGGER_SCHEMA_TITLE,
    SWAGGER_SCHEMA_VERSION,
    SWAGGER_SCHEMA_DESCRIPTION,
    SWAGGER_SCHEMA_SERVERS,
    SWAGGER_SCHEMA_TAGS,
    LOCATION_SERVICE_API_KEY,
    LOCATION_SERVICE_BASE_URL,
    FORECAST_SERVICE_API_KEY,
    FORECAST_SERVICE_BASE_URL,
    DB_TIMEOUT,
    DB_URL,
    AUTH_SECRET_KEY,
    PORT
  }
})
;((container) => {
  // needs to bring in app even though its not used otherwise it won't get initialized
  const { app, db, logger } = container.cradle
  // connect db
  db.on('connecting', () => logger.info('Connecting to the database...'))
  db.on('disconnected', () => logger.warn('Lost connection to database'))
  db.on('error', (err) => logger.error(`Database error: ${err.message}`))
})(container)
