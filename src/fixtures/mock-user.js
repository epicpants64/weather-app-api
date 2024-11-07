/* eslint-env jest */
import MockObject from './mock-object'

// mock user for testing
export default class MockUser extends MockObject {
  resetToDefaults() {
    super.resetToDefaults()

    this.emailAddress = 'test@test.com'
    this.fullName = 'Testing Tester'
    this.password = 'password'
    this.createdDate = new Date()
    return this
  }
}
