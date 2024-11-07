import express from 'express'

import { getLocationByZipcode } from '../functions/location/get-location-by-zipcode.js'

// TODO: should add auth middleware to these routes once front handles users
export const locationRoutes = () => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.send('Hello from location route!')
  })
  router.get('/zipCode', getLocationByZipcode)

  return router
}
