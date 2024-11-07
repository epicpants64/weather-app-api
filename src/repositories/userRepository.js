import mongoosePaginate from 'mongoose-paginate-v2'
import agregatePaginate from 'mongoose-aggregate-paginate-v2'

import userSchema from '../models/user.js'

export const UserRepository = async ({ db }) => {
  // wont need these for this project but likely would for most repositories for larger projects
  userSchema.plugin(mongoosePaginate)
  userSchema.plugin(agregatePaginate)

  return db.model('User', userSchema, 'users')
}
