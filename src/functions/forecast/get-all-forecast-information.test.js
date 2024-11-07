import { getAllForecastInformation } from './get-all-forecast-information'
import StatusCodes from 'http-status-codes'
import { validateAndStrip } from '../../utils/joi-helpers'

jest.mock('../../utils/joi-helpers')

const mockForecastService = {
  getAllForecastInformation: jest.fn()
}
const mockLogger = {
  error: jest.fn()
}

const mockRequest = (query = {}) => ({
  query,
  container: {
    resolve: jest.fn((service) => {
      if (service === 'forecastService') return mockForecastService
      if (service === 'logger') return mockLogger
    })
  }
})

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('getAllForecastInformation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return all forecast information with valid query parameters', async () => {
    const req = mockRequest({ lon: 12.34, lat: 56.78 })
    const res = mockResponse()

    validateAndStrip.mockReturnValue({ value: { lon: 12.34, lat: 56.78 }, error: null })
    const mockForecastData = { data: 'forecast data' }
    mockForecastService.getAllForecastInformation.mockResolvedValue(mockForecastData)

    await getAllForecastInformation(req, res)

    expect(validateAndStrip).toHaveBeenCalledWith({
      value: req.query,
      schema: expect.any(Object)
    })
    expect(mockForecastService.getAllForecastInformation).toHaveBeenCalledWith({ lon: 12.34, lat: 56.78 })
    expect(res.json).toHaveBeenCalledWith(mockForecastData)
  })

  test('should return error if query parameters are invalid', async () => {
    const req = mockRequest({ lon: 'invalid', lat: 56.78 })
    const res = mockResponse()

    validateAndStrip.mockReturnValue({
      value: null,
      error: new Error('Invalid query parameters')
    })

    await getAllForecastInformation(req, res)

    expect(validateAndStrip).toHaveBeenCalledWith({
      value: req.query,
      schema: expect.any(Object)
    })
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.send).toHaveBeenCalledWith('something went wrong in getAllForecastInformation: Invalid query parameters')
  })

  test('should handle forecast service errors gracefully', async () => {
    const req = mockRequest({ lon: 12.34, lat: 56.78 })
    const res = mockResponse()

    validateAndStrip.mockReturnValue({ value: { lon: 12.34, lat: 56.78 }, error: null })
    const serviceError = { cod: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Service Error' }
    mockForecastService.getAllForecastInformation.mockResolvedValue(serviceError)

    await getAllForecastInformation(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.send).toHaveBeenCalledWith('something went wrong in getAllForecastInformation: Service Error')
  })

  test('should handle unexpected errors gracefully', async () => {
    const req = mockRequest({ lon: 12.34, lat: 56.78 })
    const res = mockResponse()

    validateAndStrip.mockImplementation(() => {
      throw new Error('Unexpected Error')
    })

    await getAllForecastInformation(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.send).toHaveBeenCalledWith('something went wrong in getAllForecastInformation: Unexpected Error')
  })
})
