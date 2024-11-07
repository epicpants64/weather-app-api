import { getLocationByZipcode } from './get-location-by-zipcode'
import StatusCodes from 'http-status-codes'
import { validateAndStrip } from '../../utils/joi-helpers'

jest.mock('../../utils/joi-helpers')
const mockLocationService = {
  getCoordinatesByZipCode: jest.fn()
}
const mockLogger = {
  error: jest.fn()
}

const mockRequest = (query = {}) => ({
  query,
  container: {
    resolve: jest.fn((service) => {
      if (service === 'locationService') return mockLocationService
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

describe('getLocationByZipcode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return location coordinates with valid query parameters', async () => {
    const req = mockRequest({ zipCode: 12345, countryCode: 'US' })
    const res = mockResponse()

    validateAndStrip.mockReturnValue({ value: { zipCode: 12345, countryCode: 'US' }, error: null })
    const mockCoordinates = { lon: -122.4194, lat: 37.7749 }
    mockLocationService.getCoordinatesByZipCode.mockResolvedValue(mockCoordinates)

    await getLocationByZipcode(req, res)

    expect(validateAndStrip).toHaveBeenCalledWith({
      value: req.query,
      schema: expect.any(Object)
    })
    expect(mockLocationService.getCoordinatesByZipCode).toHaveBeenCalledWith({ zipCode: 12345, countryCode: 'US' })
    expect(res.json).toHaveBeenCalledWith(mockCoordinates)
  })

  test('should return error if query parameters are invalid', async () => {
    const req = mockRequest({ zipCode: 'invalid', countryCode: 'US' })
    const res = mockResponse()

    validateAndStrip.mockReturnValue({
      value: null,
      error: new Error('Invalid query parameters')
    })

    await getLocationByZipcode(req, res)

    expect(validateAndStrip).toHaveBeenCalledWith({
      value: req.query,
      schema: expect.any(Object)
    })
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.send).toHaveBeenCalledWith('something went wrong in getLocationByZipcode: Invalid query parameters')
  })

  test('should handle location service errors gracefully', async () => {
    const req = mockRequest({ zipCode: 12345, countryCode: 'US' })
    const res = mockResponse()

    validateAndStrip.mockReturnValue({ value: { zipCode: 12345, countryCode: 'US' }, error: null })
    const serviceError = { cod: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Service Error' }
    mockLocationService.getCoordinatesByZipCode.mockResolvedValue(serviceError)

    await getLocationByZipcode(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.send).toHaveBeenCalledWith('something went wrong in getLocationByZipcode: Service Error')
  })

  test('should handle unexpected errors gracefully', async () => {
    const req = mockRequest({ zipCode: 12345, countryCode: 'US' })
    const res = mockResponse()

    validateAndStrip.mockImplementation(() => {
      throw new Error('Unexpected Error')
    })

    await getLocationByZipcode(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.send).toHaveBeenCalledWith('something went wrong in getLocationByZipcode: Unexpected Error')
  })
})
