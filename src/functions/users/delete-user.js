import Joi from 'joi'
import assert from 'node:assert'
import StatusCodes from 'http-status-codes'

import { validateAndStrip } from '../../utils/joi-helpers.js'
import { createSwaggerSchema } from '../../utils/swagger.js'
import { validSwaggerMethods } from '../../constants/validSwaggerMethods.js'

/**
 * joi validation schema for deleteUser request query
 * @var {object} DELETE_USER_SCHEMA
 */
const DELETE_USER_SCHEMA = Joi.object({
  emailAddress: Joi.string().required()
})

createSwaggerSchema({
  method: validSwaggerMethods.DELETE,
  description: 'delete a new user',
  path: '/users',
  request: {
    body: DELETE_USER_SCHEMA
  },
  tags: 'users'
})

/**
 * deleteUser
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
export const deleteUser = async (req, res) => {
  const logger = req.container.resolve('logger')
  const userService = req.container.resolve('userService')

  try {
    const { value: bodyProps, error: bodyError } = validateAndStrip({
      value: req.body,
      schema: DELETE_USER_SCHEMA
    })
    assert(!bodyError, bodyError?.message)
    const { emailAddress } = bodyProps
    const existingUser = await userService.getUserByEmailAddress(emailAddress)
    // could put a message for user already exists but is arguably a security risk
    assert(!existingUser, 'Something went wrong')
    await userService.deleteUser(user)
    res.status(200)
  } catch (err) {
    logger.error(`something went wrong in createUser: ${err.message}`)
    res.status(err.status || StatusCodes.BAD_REQUEST).send(`something went wrong in createUser: ${err.message}`)
  }
}
