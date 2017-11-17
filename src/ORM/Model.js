/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import Serializer from './Serializer'
import QueryBuilder from './QueryBuilder'

class Model {
  /**
   * The serializer to be used for serializing
   * data. The return value must always be a
   * ES6 class.
   *
   * @return {Serializer}
   */
  static get Serializer () {
    return Serializer
  }

  /**
   * Constructor.
   *
   * @constructor
   * @param  {Object}  attributes  - Attributes to set
   */
  constructor (attributes = {}) {
    this.fill(attributes)
    this.$syncOriginal()
  }

  /**
   * Fills the attributes with the given one.
   *
   * @param  {Object}  attributes  - Attributes to set
   *
   * @return {void}
   */
  fill (attributes) {
    this.$attributes = attributes
  }

  /**
   * Syncs the original attributes with the current.
   *
   * @private
   *
   * @return {void}
   */
  $syncOriginal () {
    this.$original = this.$attributes
  }

  /**
   * Create an instance of the QueryBuilder.
   *
   * @static
   *
   * @return  {QueryBuilder}
   */
  static query () {
    return new QueryBuilder(this)
  }

  /**
   * Returns all records for a given model.
   *
   * @param  {string[]}     fields   - Specific fields to retrieve
   * @param  {number|null}  version  - Version to use for the query
   *
   * @return {Promise<Model[]>}
   */
  static all (fields, version) {
    return this.query().fetch(fields, version)
  }

  /**
   * Returns a record for given paramters.
   *
   * @param  {number}       key     - Specific key to search for
   * @param  {string[]}     fields  - Specific fields to retrieve
   *
   * @return {Promise<Model>}
   */
  static find (key, fields) {
    return this.query().find(key, fields)
  }

  /**
   *
   * @return {Object}
   */
  toObject () {
    return this.$attributes
  }

  /**
   * Converts model instance toJSON using the serailizer
   * toJSON method.
   *
   * @return {Object}
   */
  toJSON () {
    return new this.constructor.Serializer(this, {}, true).toJSON()
  }
}

export default Model
