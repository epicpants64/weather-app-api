import Joi from 'joi'
import assert from 'node:assert'
import StatusCodes from 'http-status-codes'

import { validateAndStrip } from '../../utils/joi-helpers.js'
import { createSwaggerSchema } from '../../utils/swagger.js'
import { validSwaggerMethods } from '../../constants/validSwaggerMethods.js'

/**
 * joi validation schema for getLocationByZipcode request query
 * @var {object} ZIP_CODE_REQUEST_SCHEMA
 */
// TODO: make zipcode validation check if poper us zipcode
const ZIP_CODE_REQUEST_SCHEMA = Joi.object({
  zipCode: Joi.number().required(),
  countryCode: Joi.string().required()
})

createSwaggerSchema({
  method: validSwaggerMethods.GET,
  description: 'get location lon and lat from a zipcode and country code',
  path: '/location/zipcode',
  request: {
    query: ZIP_CODE_REQUEST_SCHEMA
  },
  tags: 'location'
})

/**
 * getLocationByZipcode - Get location lon and lat from a zipcode and country code
 * @param {express.Request} req
 * @param {express.Reponse} res
 * @returns object
 */
export const getLocationByZipcode = async (req, res) => {
  const locationService = req.container.resolve('locationService')
  const logger = req.container.resolve('logger')

  try {
    const { value: queryProps, error: queryError } = validateAndStrip({
      value: req.query,
      schema: ZIP_CODE_REQUEST_SCHEMA
    })
    assert(!queryError, queryError?.message)
    const { zipCode, countryCode } = queryProps
    const locationCooridates = await locationService.getCoordinatesByZipCode({ zipCode, countryCode })
    if (locationCooridates?.cod && locationCooridates?.cod !== StatusCodes.OK) {
      logger.error(`something went wrong in getLocationByZipcode: ${locationCooridates?.message}`)
      res.status(locationCooridates?.cod).send(`something went wrong in getLocationByZipcode: ${locationCooridates?.message}`)
    } else {
      res.json(locationCooridates)
    }
  } catch (err) {
    logger.error(`something went wrong in getLocationByZipcode: ${err.message}`)
    res.status(err.status || StatusCodes.BAD_REQUEST).send(`something went wrong in getLocationByZipcode: ${err.message}`)
  }
}
