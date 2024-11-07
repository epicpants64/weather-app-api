import Joi from 'joi'
import assert from 'node:assert'
import StatusCodes from 'http-status-codes'

import { validateAndStrip } from '../../utils/joi-helpers.js'
import { createSwaggerSchema } from '../../utils/swagger.js'
import { validSwaggerMethods } from '../../constants/validSwaggerMethods.js'

/**
 * joi validation schema for getWeeklyForecast request query
 * @var {object} HOURLY_FORECAST_REQUEST_SCHEMA
 */
const HOURLY_FORECAST_REQUEST_SCHEMA = Joi.object({
  lon: Joi.number().required(),
  lat: Joi.number().required()
})

createSwaggerSchema({
  method: validSwaggerMethods.GET,
  description: 'Get this todays forecast by hour from a lon and lat of a location',
  path: '/weather/hourly',
  request: {
    query: HOURLY_FORECAST_REQUEST_SCHEMA
  },
  tags: 'weather'
})

/**
 * getWeeklyForecast - Get this todays forecast by hour from a lon and lat of a location
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getHourlyForecast = async (req, res) => {
  const forecastService = req.container.resolve('forecastService')
  const logger = req.container.resolve('logger')
  try {
    const { value: queryProps, error: queryError } = validateAndStrip({
      value: req.query,
      schema: HOURLY_FORECAST_REQUEST_SCHEMA
    })
    assert(!queryError, queryError?.message)

    // get location coordinates for zipcode to pass to forecast call
    const { lon, lat } = queryProps

    const hourly = await forecastService.getHourlyForecast({ lon, lat })

    //sometimes the response isn't an okay response but it doesn't throw from the api
    if (hourly?.cod && hourly?.cod !== StatusCodes.OK) {
      logger.error(`something went wrong in getHourlyForecast: ${hourly?.message}`)
      res.status(hourly?.cod).send(`something went wrong in getHourlyForecast: ${hourly?.message}`)
    } else {
      res.json(hourly)
    }
  } catch (err) {
    logger.error(`something went wrong in getHourlyForecast: ${err.message}`)
    res.status(err.status || StatusCodes.BAD_REQUEST).send(`something went wrong in getHourlyForecast: ${err.message}`)
  }
}
