import assert from 'node:assert'

export default class ForecastService {
  constructor({ config, serviceUrl, logger }) {
    assert(typeof serviceUrl === 'string', 'Weather Service URL is required')
    this.logger = logger
    this.forecastServiceApiKey = config.FORECAST_SERVICE_API_KEY
    this.baseUrl = serviceUrl
    this.timeOptions = {
      current: 'current',
      minutely: 'minutely',
      hourly: 'hourly',
      daily: 'daily',
      alerts: 'alerts'
    }
  }

  /**
   * getCurrentForecast
   * Get current forecast of a location from lon and lat
   * @param {decimal} lon
   * @param {decimal} lat
   * @returns response
   */
  async getCurrentForecast({ lon, lat }) {
    const timesToExclude = this.timeOptions
    delete timesToExclude.current
    const timesToExcludeQuery = Object.values(timesToExclude).join(',')
    const params = new URLSearchParams({
      lon,
      lat,
      appid: this.forecastServiceApiKey,
      units: 'imperial',
      exclude: timesToExcludeQuery
    })
    try {
      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await response.json()
    } catch (err) {
      this.logger.error(`something went wrong in getCurrentForecast: ${err.message}`)
    }
  }

  /**
   * Get 7 day forecast
   * Get 7 days of forecast for a location from lon and lat
   * @param {decimal} lon
   * @param {decimal} lat
   * @returns response
   */
  async getWeeklyForecast({ lon, lat }) {
    const timesToExclude = this.timeOptions
    delete timesToExclude.weekly
    const params = new URLSearchParams({
      lon,
      lat,
      cnt: 7,
      appid: this.forecastServiceApiKey,
      units: 'imperial',
      exclude: timesToExclude
    })
    try {
      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await response.json()
    } catch (err) {
      this.logger.error(`something went wrong in getWeeklyForecast: ${err.message}`)
    }
  }

  /**
   * Get today's hourly forecast for a location from lon and lat
   * @param {decimal} lon
   * @param {decimal} lat
   * @returns response
   */
  async getHourlyForecast({ lon, lat }) {
    const timesToExclude = this.timeOptions
    delete timesToExclude.hourly
    const params = new URLSearchParams({
      lon,
      lat,
      appid: this.forecastServiceApiKey,
      units: 'imperial',
      exclude: timesToExclude
    })
    try {
      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await response.json()
    } catch (err) {
      this.logger.error(`something went wrong in getHourlyForecast: ${err.message}`)
    }
  }

  /**
   * Get all forecast information for a location from lon and lat
   * @param {decimal} lon
   * @param {decimal} lat
   * @returns response
   */
  async getAllForecastInformation({ lon, lat }) {
    const params = new URLSearchParams({
      lon,
      lat,
      appid: this.forecastServiceApiKey,
      units: 'imperial'
    })
    try {
      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await response.json()
    } catch (err) {
      this.logger.error(`something went wrong in getAllForecastInformation: ${err?.message}`)
    }
  }
}
