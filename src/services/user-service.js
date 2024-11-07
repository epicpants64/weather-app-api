export default class UserService {
  constructor({ logger, userRepository }) {
    this.logger = logger
    this.userRepository = userRepository
  }

  /**
   * getUserByEmailAddress
   * get user by email address
   * @param {string} emailAddress
   * @returns object (User)
   */
  async getUserByEmailAddress(emailAddress) {
    try {
      return await this.userRepository.findOne({ emailAddress })
    } catch (err) {
      this.logger.error(`something went wrong in getUserByEmailAddress: ${err.message}`)
    }
  }

  /**
   * createUser
   * create user in the db
   * @param {User} user
   */
  async createUser(user) {
    try {
      return await this.userRepository.create(user)
    } catch (err) {
      this.logger.error(`something went wrong in createUser: ${err.message}`)
    }
  }

  /**
   * deleteUser
   * delete user in the db
   * @param {User} user
   */
  async deleteUser(user) {
    try {
      return await this.userRepository.delete(user)
    } catch (err) {
      this.logger.error(`something went wrong in deleteUser: ${err.message}`)
    }
  }
}
