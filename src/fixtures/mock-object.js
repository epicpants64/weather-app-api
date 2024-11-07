import assert from 'node:assert'
import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

// Old file that I have had in other projects super helpful for mocking objects espcially with mongo
// Base class for mockable objects
export default class MockObject {
  constructor({ id, ...props } = {}) {
    this.id = id ?? new ObjectId()
    this.resetToDefaults()
    this.setValues(props)
  }

  // Resets the mock to default values
  resetToDefaults() {
    return this
  }

  // Sets several properties at once
  setValues(props) {
    assert(props && typeof props === 'object', 'Props must be an object')
    for (const [key, value] of Object.entries(props)) {
      // Do not allow functions to be overridden
      if (typeof this[key] !== 'function') {
        this[key] = value
      }
    }
    return this
  }

  // Gets the ID as an ObjectId instance
  get _id() {
    return ObjectId(this.id)
  }

  // Gets the string value of the instance
  toString() {
    this.id.toString()
  }

  // Gets the JSON object representation of the class (including _id)
  toJSON() {
    return Object.keys(this)
      .filter((key) => typeof this[key] !== 'function')
      .reduce(
        (obj, key) => {
          obj[key] = this[key]
          return obj
        },
        { _id: this._id }
      )
  }

  toObject() {
    return this.toJSON()
  }

  save() {}
}
