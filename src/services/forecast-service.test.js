import ForecastService from './forecast-service'

global.fetch = jest.fn()

const mockLogger = {
  error: jest.fn()
}
const mockConfig = {
  FORECAST_SERVICE_API_KEY: 'mock-api-key'
}
const serviceUrl = 'https://mock-weather-service.com'

describe('ForecastService', () => {
  let forecastService

  beforeEach(() => {
    forecastService = new ForecastService({
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
    expect(() => new ForecastService({ config: mockConfig, logger: mockLogger })).toThrow('Weather Service URL is required')
  })

  describe('getCurrentForecast', () => {
    test('should fetch current forecast data for given coordinates', async () => {
      const lon = -122.4194
      const lat = 37.7749
      const data = { temp: 72, weather: 'clear' }
      fetch.mockResolvedValue(mockResponse(data))

      const result = await forecastService.getCurrentForecast({ lon, lat })

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`${serviceUrl}?lon=${lon}&lat=${lat}`), expect.any(Object))
      expect(result).toEqual(data)
    })

    test('should log error if fetch fails', async () => {
      fetch.mockRejectedValue(new Error('Network error'))

      await forecastService.getCurrentForecast({ lon: 0, lat: 0 })

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('something went wrong in getCurrentForecast: Network error'))
    })
  })

  describe('getWeeklyForecast', () => {
    test('should fetch weekly forecast data for given coordinates', async () => {
      const lon = -122.4194
      const lat = 37.7749
      const data = { forecast: '7-day data' }
      fetch.mockResolvedValue(mockResponse(data))

      const result = await forecastService.getWeeklyForecast({ lon, lat })

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`${serviceUrl}?lon=${lon}&lat=${lat}&cnt=7`), expect.any(Object))
      expect(result).toEqual(data)
    })

    test('should log error if fetch fails', async () => {
      fetch.mockRejectedValue(new Error('Network error'))

      await forecastService.getWeeklyForecast({ lon: 0, lat: 0 })

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('something went wrong in getWeeklyForecast: Network error'))
    })
  })

  describe('getHourlyForecast', () => {
    test('should fetch hourly forecast data for given coordinates', async () => {
      const lon = -122.4194
      const lat = 37.7749
      const data = { forecast: 'hourly data' }
      fetch.mockResolvedValue(mockResponse(data))

      const result = await forecastService.getHourlyForecast({ lon, lat })

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`${serviceUrl}?lon=${lon}&lat=${lat}`), expect.any(Object))
      expect(result).toEqual(data)
    })

    test('should log error if fetch fails', async () => {
      fetch.mockRejectedValue(new Error('Network error'))

      await forecastService.getHourlyForecast({ lon: 0, lat: 0 })

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('something went wrong in getHourlyForecast: Network error'))
    })
  })

  describe('getAllForecastInformation', () => {
    test('should fetch all forecast information for given coordinates', async () => {
      const lon = -122.4194
      const lat = 37.7749
      const data = { forecast: 'all data' }
      fetch.mockResolvedValue(mockResponse(data))

      const result = await forecastService.getAllForecastInformation({ lon, lat })

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`${serviceUrl}?lon=${lon}&lat=${lat}`), expect.any(Object))
      expect(result).toEqual(data)
    })

    test('should log error if fetch fails', async () => {
      fetch.mockRejectedValue(new Error('Network error'))

      await forecastService.getAllForecastInformation({ lon: 0, lat: 0 })

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('something went wrong in getAllForecastInformation: Network error'))
    })
  })
})
