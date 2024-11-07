import express from 'express'

import { createUser } from '../functions/users/create-user.js'
import { deleteUser } from '../functions/users/delete-user.js'
import { loginUser } from '../functions/users/login-user.js'

export const userRoutes = () => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.send('Hello from users route!')
  })
  router.post('/', createUser)
  router.delete('/', deleteUser)
  router.post('/login', loginUser)

  return router
}
