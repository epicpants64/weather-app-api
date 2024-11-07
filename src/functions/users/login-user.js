import jwt from 'jsonwebtoken'
import Joi from 'joi'
import assert from 'node:assert'
import StatusCodes from 'http-status-codes'

import { validateAndStrip } from '../../utils/joi-helpers.js'
import { createSwaggerSchema } from '../../utils/swagger.js'
import { validSwaggerMethods } from '../../constants/validSwaggerMethods.js'

/**
 * joi validation schema for loginUser request query
 * @var {object} LOGIN_USER_SCHEMA
 */
const LOGIN_USER_SCHEMA = Joi.object({
  emailAddress: Joi.string().required(),
  password: Joi.string().required()
})

createSwaggerSchema({
  method: validSwaggerMethods.POST,
  description: 'login a new user/get a token',
  path: '/users/login',
  request: {
    body: LOGIN_USER_SCHEMA
  },
  tags: 'users'
})

/**
 * loginUser
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns token
 */
export const loginUser = async (req, res) => {
  const logger = req.container.resolve('logger')
  const userService = req.container.resolve('userService')

  try {
    const { value: bodyProps, error: bodyError } = validateAndStrip({
      value: req.body,
      schema: LOGIN_USER_SCHEMA
    })
    assert(!bodyError, bodyError?.message)
    const { emailAddress, password } = bodyProps

    const existingUser = await userService.getUserByEmailAddress(emailAddress)
    // could put a message for user already exists but is arguably a security risk
    assert(!existingUser, 'Something went wrong')

    const isValidPassword = await user.comparePassword(password)
    // specifying that it is a bad password and not maybe a bad user is a security risk
    assert(isValidPassword, 'invalid username or password')

    const token = jwt.sign({ emailAddress: user.emailAddress }, process.env.AUTH_SECRET_KEY, {
      expiresIn: '15m'
    })
    res.json({ token })
  } catch (err) {
    logger.error(`something went wrong in loginUser: ${err.message}`)
    res.status(err.status || StatusCodes.BAD_REQUEST).send(`something went wrong in loginUser: ${err.message}`)
  }
}
