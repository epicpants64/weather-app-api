import assert from 'node:assert'

export default class LocationService {
  constructor({ config, serviceUrl, logger }) {
    assert(typeof serviceUrl === 'string', 'Location Service URL is required')
    this.logger = logger
    this.locationServiceApiKey = config.LOCATION_SERVICE_API_KEY
    this.baseUrl = serviceUrl
  }

  /**
   * getCoordinatesByZipCode
   * Get location lon and lat from a zipcode
   * NOTE: must be ISO 3166 country codes
   * @param {int} zipCode
   * @param {string} countryCode
   * @returns object
   */
  async getCoordinatesByZipCode({ zipCode, countryCode }) {
    const params = new URLSearchParams({
      zip: `${zipCode},${countryCode}`,
      appid: this.locationServiceApiKey
    })
    try {
      const response = await fetch(`${this.baseUrl}/zip?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await response.json()
    } catch (err) {
      this.logger.error(`something went wrong in getLocationByZipCode: ${err.message}`)
    }
  }
}
