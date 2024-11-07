import mongoose from 'mongoose'
import assert from 'node:assert'

export const connectToDatabase = ({ connectionUrl }) => {
  assert(typeof connectionUrl === 'string' && connectionUrl.trim(), 'DB connection URL is required, should be added to .env as DB_URL')

  return mongoose.createConnection(connectionUrl)
}
