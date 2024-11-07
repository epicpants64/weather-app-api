import { Schema } from 'mongoose'
import { comparePasswords } from '../utils/passwords.js'

const userSchema = new Schema({
  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  return await comparePasswords(password, this.password)
}

// Create indexes for most searched props
userSchema.index({ emailAddress: 1 })

export default userSchema
