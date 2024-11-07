import UserService from './user-service'

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  delete: jest.fn()
}

const mockLogger = {
  error: jest.fn()
}

describe('UserService', () => {
  let userService

  beforeEach(() => {
    userService = new UserService({
      logger: mockLogger,
      userRepository: mockUserRepository
    })
    jest.clearAllMocks()
  })

  describe('getUserByEmailAddress', () => {
    it('should retrieve user by email address', async () => {
      const emailAddress = 'test@example.com'
      const user = { id: 1, emailAddress }
      mockUserRepository.findOne.mockResolvedValue(user)

      const result = await userService.getUserByEmailAddress(emailAddress)

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ emailAddress })
      expect(result).toEqual(user)
    })

    it('should log an error if getUserByEmailAddress fails', async () => {
      const emailAddress = 'test@example.com'
      const error = new Error('Database error')
      mockUserRepository.findOne.mockRejectedValue(error)

      const result = await userService.getUserByEmailAddress(emailAddress)

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('something went wrong in getUserByEmailAddress'))
      expect(result).toBeUndefined()
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = { emailAddress: 'newuser@example.com', fullName: 'New User' }
      mockUserRepository.create.mockResolvedValue(user)

      const result = await userService.createUser(user)

      expect(mockUserRepository.create).toHaveBeenCalledWith(user)
      expect(result).toEqual(user)
    })

    it('should log an error if createUser fails', async () => {
      const user = { emailAddress: 'newuser@example.com', fullName: 'New User' }
      const error = new Error('Database error')
      mockUserRepository.create.mockRejectedValue(error)

      const result = await userService.createUser(user)

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('something went wrong in createUser'))
      expect(result).toBeUndefined()
    })
  })

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      const user = { id: 1, emailAddress: 'delete@example.com' }
      mockUserRepository.delete.mockResolvedValue(true)

      const result = await userService.deleteUser(user)

      expect(mockUserRepository.delete).toHaveBeenCalledWith(user)
      expect(result).toBe(true)
    })

    it('should log an error if deleteUser fails', async () => {
      const user = { id: 1, emailAddress: 'delete@example.com' }
      const error = new Error('Database error')
      mockUserRepository.delete.mockRejectedValue(error)

      const result = await userService.deleteUser(user)

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('something went wrong in deleteUser'))
      expect(result).toBeUndefined()
    })
  })
})
