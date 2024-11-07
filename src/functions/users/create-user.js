import Joi from 'joi'
import assert from 'node:assert'
import StatusCodes from 'http-status-codes'

import { hashPassword } from '../../utils/passwords.js'
import { validateAndStrip } from '../../utils/joi-helpers.js'
import { createSwaggerSchema } from '../../utils/swagger.js'
import { validSwaggerMethods } from '../../constants/validSwaggerMethods.js'

/**
 * joi validation schema for createUser request query
 * @var {object} CREATE_USER_SCHEMA
 */
const CREATE_USER_SCHEMA = Joi.object({
  emailAddress: Joi.string().required(),
  fullName: Joi.string().required(),
  password: Joi.string().required()
})

createSwaggerSchema({
  method: validSwaggerMethods.POST,
  description: 'create a new user',
  path: '/users',
  request: {
    body: CREATE_USER_SCHEMA
  },
  tags: 'users'
})

/**
 * createUser
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns string (emailAddress)
 */
export const createUser = async (req, res) => {
  const logger = req.container.resolve('logger')
  const userService = req.container.resolve('userService')

  try {
    const { value: bodyProps, error: bodyError } = validateAndStrip({
      value: req.body,
      schema: CREATE_USER_SCHEMA
    })
    assert(!bodyError, bodyError?.message)
    const { emailAddress, password } = bodyProps
    const existingUser = await userService.getUserByEmailAddress(emailAddress)
    // could put a message for user already exists but is arguably a security risk
    assert(!existingUser, 'Something went wrong')

    const hashedPassword = await hashPassword(password)
    const user = { emailAddress, fullName, password: hashedPassword }
    await userService.createUser(user)
    res.status(201).json({ emailAddress, fullName })
  } catch (err) {
    logger.error(`something went wrong in createUser: ${err.message}`)
    res.status(err.status || StatusCodes.BAD_REQUEST).send(`something went wrong in createUser: ${err.message}`)
  }
}
