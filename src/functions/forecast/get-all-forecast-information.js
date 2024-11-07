import Joi from 'joi'
import assert from 'node:assert'
import StatusCodes from 'http-status-codes'

import { validateAndStrip } from '../../utils/joi-helpers.js'
import { createSwaggerSchema } from '../../utils/swagger.js'
import { validSwaggerMethods } from '../../constants/validSwaggerMethods.js'

/**
 * joi validation schema for getAllForecastInformation request query
 * @var {object} ALL_FORECAST_REQUEST_SCHEMA
 */
const ALL_FORECAST_REQUEST_SCHEMA = Joi.object({
  lon: Joi.number().required(),
  lat: Joi.number().required()
})

createSwaggerSchema({
  method: validSwaggerMethods.GET,
  description: 'Get all weather info (current, hourly, weekly) from a lon and lat of a location',
  path: '/weather/all',
  request: {
    query: ALL_FORECAST_REQUEST_SCHEMA
  },
  tags: 'weather'
})

/**
 * getAllForecastInformation - Get all weather info (current, hourly, weekly) from a lon and lat of a location
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getAllForecastInformation = async (req, res) => {
  const forecastService = req.container.resolve('forecastService')
  const logger = req.container.resolve('logger')
  try {
    const { value: queryProps, error: queryError } = validateAndStrip({
      value: req.query,
      schema: ALL_FORECAST_REQUEST_SCHEMA
    })
    assert(!queryError, queryError?.message)

    // get location coordinates for zipcode to pass to forecast call
    const { lon, lat } = queryProps

    const allInfo = await forecastService.getAllForecastInformation({ lon, lat })

    //sometimes the response isn't an okay response but it doesn't throw from the api
    if (allInfo?.cod && allInfo?.cod !== StatusCodes.OK) {
      logger.error(`something went wrong in getAllForecastInformation: ${allInfo?.message}`)
      res.status(allInfo?.cod).send(`something went wrong in getAllForecastInformation: ${allInfo?.message}`)
    } else {
      res.json(allInfo)
    }
  } catch (err) {
    logger.error(`something went wrong in getAllForecastInformation: ${err.message}`)
    res.status(err.status || StatusCodes.BAD_REQUEST).send(`something went wrong in getAllForecastInformation: ${err.message}`)
  }
}
