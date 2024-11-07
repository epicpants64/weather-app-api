import Joi from 'joi'
import assert from 'node:assert'
import StatusCodes from 'http-status-codes'

import { validateAndStrip } from '../../utils/joi-helpers.js'
import { createSwaggerSchema } from '../../utils/swagger.js'
import { validSwaggerMethods } from '../../constants/validSwaggerMethods.js'

/**
 * joi validation schema for getCurrentForecast request query
 * @var {object} CURRENT_FORECAST_REQUEST_SCHEMA
 */
const CURRENT_FORECAST_REQUEST_SCHEMA = Joi.object({
  lon: Joi.number().required(),
  lat: Joi.number().required()
})

createSwaggerSchema({
  method: validSwaggerMethods.GET,
  description: 'Get current forecast from a lon and lat of a location',
  path: '/weather/current',
  request: {
    query: CURRENT_FORECAST_REQUEST_SCHEMA
  },
  tags: 'weather'
})

/**
 * getCurrentForecast - Get current forecast from a lon and lat of a location
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getCurrentForecast = async (req, res) => {
  const forecastService = req.container.resolve('forecastService')
  const logger = req.container.resolve('logger')
  try {
    const { value: queryProps, error: queryError } = validateAndStrip({
      value: req.query,
      schema: CURRENT_FORECAST_REQUEST_SCHEMA
    })
    assert(!queryError, queryError?.message)

    // get location coordinates for zipcode to pass to forecast call
    const { lon, lat } = queryProps

    const current = await forecastService.getCurrentForecast({ lon, lat })

    //sometimes the response isn't an okay response but it doesn't throw from the api
    if (current?.cod && current?.cod !== StatusCodes.OK) {
      logger.error(`something went wrong in getCurrentForecast: ${current?.message}`)
      res.status(current?.cod).send(`something went wrong in getcurrentForecast: ${current?.message}`)
    } else {
      res.json(current)
    }
  } catch (err) {
    logger.error(`something went wrong in getCurrentForecast: ${err.message}`)
    res.status(err.status || StatusCodes.BAD_REQUEST).send(`something went wrong in getCurrentForecast: ${err.message}`)
  }
}
