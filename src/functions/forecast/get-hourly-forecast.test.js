import { getHourlyForecast } from './get-hourly-forecast'
import StatusCodes from 'http-status-codes'
import { validateAndStrip } from '../../utils/joi-helpers'

jest.mock('../../utils/joi-helpers')

const mockForecastService = {
  getHourlyForecast: jest.fn()
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

describe('getHourlyForecast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return hourly forecast with valid query parameters', async () => {
    const req = mockRequest({ lon: 12.34, lat: 56.78 })
    const res = mockResponse()

    validateAndStrip.mockReturnValue({ value: { lon: 12.34, lat: 56.78 }, error: null })
    const mockHourlyData = { data: 'hourly forecast data' }
    mockForecastService.getHourlyForecast.mockResolvedValue(mockHourlyData)

    await getHourlyForecast(req, res)

    expect(validateAndStrip).toHaveBeenCalledWith({
      value: req.query,
      schema: expect.any(Object)
    })
    expect(mockForecastService.getHourlyForecast).toHaveBeenCalledWith({ lon: 12.34, lat: 56.78 })
    expect(res.json).toHaveBeenCalledWith(mockHourlyData)
  })

  test('should return error if query parameters are invalid', async () => {
    const req = mockRequest({ lon: 'invalid', lat: 56.78 })
    const res = mockResponse()

    validateAndStrip.mockReturnValue({
      value: null,
      error: new Error('Invalid query parameters')
    })

    await getHourlyForecast(req, res)

    expect(validateAndStrip).toHaveBeenCalledWith({
      value: req.query,
      schema: expect.any(Object)
    })
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.send).toHaveBeenCalledWith('something went wrong in getHourlyForecast: Invalid query parameters')
  })

  test('should handle forecast service errors gracefully', async () => {
    const req = mockRequest({ lon: 12.34, lat: 56.78 })
    const res = mockResponse()

    validateAndStrip.mockReturnValue({ value: { lon: 12.34, lat: 56.78 }, error: null })
    const serviceError = { cod: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Service Error' }
    mockForecastService.getHourlyForecast.mockResolvedValue(serviceError)

    await getHourlyForecast(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.send).toHaveBeenCalledWith('something went wrong in getHourlyForecast: Service Error')
  })

  test('should handle unexpected errors gracefully', async () => {
    const req = mockRequest({ lon: 12.34, lat: 56.78 })
    const res = mockResponse()

    validateAndStrip.mockImplementation(() => {
      throw new Error('Unexpected Error')
    })

    await getHourlyForecast(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.send).toHaveBeenCalledWith('something went wrong in getHourlyForecast: Unexpected Error')
  })
})
