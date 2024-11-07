import express from 'express'
import { scopePerRequest } from 'awilix-express'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import bodyParser from 'body-parser'
import path from 'node:path'

import { forecastRoutes } from './routes/forecast.js'
import { locationRoutes } from './routes/location.js'
import { userRoutes } from './routes/users.js'
import { getSwaggerSpecification } from './utils/swagger.js'
import { errorHandler } from './middleware/errorHandler.js'
import { seedDatabase } from './seed.js'

export const initializeApp = async ({ container, config, rateLimiter }) => {
  const app = express()
  const { PORT } = config

  // container scope for requests
  if (container) {
    app.use(scopePerRequest(container))
    // rate limiter - this is a 1 mintute limit
    app.use(await rateLimiter)
  }

  // security
  app.use(helmet())
  app.use(express.static('public'))

  // body parser
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // global/catch-all express error handling
  app.use(errorHandler)

  // routes
  app.use('/forecast', forecastRoutes())
  app.use('/location', locationRoutes())
  app.use('/users', userRoutes())

  // swagger
  if (config.ENABLE_SWAGGER) {
    const swaggerEndpoint = '/swagger'
    const specs = getSwaggerSpecification(config)
    app.use(swaggerEndpoint, swaggerUi.serve, swaggerUi.setup(specs))
  }

  // make linking in frontend work
  app.get('*', (req, res) => res.sendFile(path.resolve('public', 'index.html')))

  // seed database (usually would be part of CI pipeline not every time you run just due to time contraints)
  await seedDatabase()

  const port = parseInt(PORT, 10) || 5001
  app.listen(port, () => console.log(`Server started on port ${port}`))

  return app
}
