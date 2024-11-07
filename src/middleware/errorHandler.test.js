import { errorHandler } from './errorHandler'

describe('errorHandler', () => {
  let mockReq, mockRes, mockNext

  beforeEach(() => {
    mockReq = {}
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    mockNext = jest.fn()
  })

  it('should return a 500 status if no status is provided in the error', () => {
    const error = new Error('Something went wrong')
    error.status = undefined
    error.message = 'Something went wrong'

    errorHandler(error, mockReq, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Something went wrong',
        status: 500
      }
    })
  })

  it('should return the correct status and message from the error object', () => {
    const error = new Error('Not found')
    error.status = 404
    error.message = 'Not found'

    errorHandler(error, mockReq, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(404)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Not found',
        status: 404
      }
    })
  })

  it('should return 500 status if no error status is provided', () => {
    const error = new Error('Unexpected server error')
    error.status = undefined
    error.message = 'Unexpected server error'

    errorHandler(error, mockReq, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Unexpected server error',
        status: 500
      }
    })
  })

  it('should handle cases where the message is missing from the error', () => {
    const error = new Error()
    error.status = 400
    error.message = undefined

    errorHandler(error, mockReq, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Error occurred',
        status: 400
      }
    })
  })

  it('should call next if the error does not have a status or message', () => {
    const error = {}

    errorHandler(error, mockReq, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Error occurred',
        status: 500
      }
    })
  })
})
