import LocationService from './location-service'

global.fetch = jest.fn()

const mockLogger = {
  error: jest.fn()
}
const mockConfig = {
  LOCATION_SERVICE_API_KEY: 'mock-api-key'
}
const serviceUrl = 'https://mock-location-service.com'

describe('LocationService', () => {
  let locationService

  beforeEach(() => {
    locationService = new LocationService({
      config: mockConfig,
      serviceUrl,
      logger: mockLogger
    })
    fetch.mockClear()
    mockLogger.error.mockClear()
  })

  const mockResponse = (data) => ({
    json: jest.fn().mockResolvedValue(data)
  })

  test('should throw an error if serviceUrl is not provided', () => {
    expect(() => new LocationService({ config: mockConfig, logger: mockLogger })).toThrow('Location Service URL is required')
  })

  describe('getCoordinatesByZipCode', () => {
    test('should fetch coordinates by zip code and country code', async () => {
      const zipCode = '12345'
      const countryCode = 'US'
      const data = { lon: -73.935242, lat: 40.73061 }
      fetch.mockResolvedValue(mockResponse(data))

      const result = await locationService.getCoordinatesByZipCode({ zipCode, countryCode })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${serviceUrl}/zip?zip=${zipCode}%2C${countryCode}&appid=mock-api-key`),
        expect.any(Object)
      )
      expect(result).toEqual(data)
    })

    test('should log error if fetch fails', async () => {
      fetch.mockRejectedValue(new Error('Network error'))

      await locationService.getCoordinatesByZipCode({ zipCode: '12345', countryCode: 'US' })

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('something went wrong in getLocationByZipCode: Network error'))
    })
  })
})
