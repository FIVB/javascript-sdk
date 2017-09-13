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
  constructor (attributes) {
    const atr = attributes

    // if (this.constructor.isXml === true) {
    //   Object.keys(atr).forEach((key) => {
    //     atr[`${key.charAt(0).toLowerCase()}${key.slice(1)}`] = atr[key]
    //     delete atr[key]
    //   })
    // }

    this.$original = atr
    this.$attributes = atr
  }

  /**
   * Syncs the original attributes with the current.
   *
   * @private
   *
   * @return {this}
   */
  $syncOriginal () {
    this.$original = this.$attributes

    return this
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
   * @param  {string[]}     param.fields   - Specific fields to retrieve
   * @param  {number|null}  param.version  - Version to use for the query
   *
   * @return {Promise}
   */
  static all (params) {
    return this.query().fetch(params)
  }

  static find (params) {
    return this.query().find(params)
  }

  /**
   *
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
    return new this.constructor.Serializer(this, true).toJSON()
  }
}

export default Model
