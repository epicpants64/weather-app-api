import { UserRepository } from './repositories/userRepository.js'
import { hashPassword } from './utils/passwords.js'

const initialUser = {
  emailAddress: 'test@test.com'
}

// TODO: make this work
export const seedDatabase = async () => {
  try {
    // Deletes all data and seeds initial info
    // await UserRepository.deleteMany({})
    // initialUser.password = await hashPassword('password')
    // await UserRepository.create(initialUser)
    console.log('Seed completed')
  } catch (error) {
    console.error('Error trying to seed database', error)
  }
}
