import assert from 'node:assert'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { UserRepository } from '../repositories/userRepository'

export const authenticate = async (req, res, next) => {
  const userService = req.container.resolve('userService')
  const token = req.headers.authorization?.split(' ')[1]
  assert(token, StatusCodes.UNAUTHORIZED, "error: 'Missing authentication token'")

  try {
    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET_KEY)
    const user = await userService.getUserByEmailAddress(decodedToken.emailAddress)
    // could do not found with a user not found message but arguably a security issue
    assert(user, StatusCodes.UNAUTHORIZED, 'There was an issue with your user authentication')

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Missing or Invalid token' })
  }
}
