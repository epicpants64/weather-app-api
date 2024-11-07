import { asClass, asFunction, asValue, createContainer } from 'awilix'

import { initializeApp } from './app.js'
import createLogger from './logger.js'
import { connectToDatabase } from './db.js'
import LocationService from './services/location-service.js'
import ForecastService from './services/forecast-service.js'
import UserService from './services/user-service.js'
import { UserRepository } from './repositories/userRepository.js'
import { configureRateLimiter } from './middleware/rateLimiter.js'

export const intializeContainer = ({ config }) => {
  const container = createContainer()
  container.register({
    config: asValue(config),
    logger: asFunction(createLogger)
      .inject(() => ({
        name: config.LOG_NAME,
        level: config.LOG_LEVEL,
        singleLine: false
      }))
      .singleton(),
    app: asFunction(initializeApp)
      .inject(() => ({ container }))
      .singleton(),
    db: asFunction(connectToDatabase)
      .inject(() => ({
        connectionUrl: config.DB_URL
      }))
      .singleton(),
    locationService: asClass(LocationService)
      .inject(() => ({ serviceUrl: config.LOCATION_SERVICE_BASE_URL }))
      .singleton(),
    forecastService: asClass(ForecastService)
      .inject(() => ({ serviceUrl: config.FORECAST_SERVICE_BASE_URL }))
      .singleton(),
    userService: asClass(UserService).singleton(),
    rateLimiter: asFunction(configureRateLimiter)
      .inject(() => ({ host: config.REDIS_HOST, port: config.REDIS_PORT }))
      .singleton(),

    // repositories (data access)
    // still use singleton so that mongoose plugins are only registered once
    userRepository: asFunction(UserRepository).singleton()
  })
  return container
}
