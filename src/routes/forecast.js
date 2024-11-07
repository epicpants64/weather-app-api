import express from 'express'

import { getCurrentForecast } from '../functions/forecast/get-current-forecast.js'
import { getWeeklyForecast } from '../functions/forecast/get-weekly-forecast.js'
import { getHourlyForecast } from '../functions/forecast/get-hourly-forecast.js'
import { getAllForecastInformation } from '../functions/forecast/get-all-forecast-information.js'

// TODO: should add auth middleware to these routes once front handles users
export const forecastRoutes = () => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.send('Hello from forecast route!')
  })
  router.get('/current', getCurrentForecast)
  router.get('/week', getWeeklyForecast)
  router.get('/hourly', getHourlyForecast)
  router.get('/all', getAllForecastInformation)
  return router
}
