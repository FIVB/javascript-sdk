/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

class Serializer {
  /**
   * Constructor.
   *
   * @constructor
   */
  constructor (rows, meta = {}, isOne = false) {
    this.$rows = rows
    this.$meta = meta
    this.$isOne = isOne
  }

  /**
   * Returns the json object for a given model instance.
   *
   * @private
   * @param  {Model}    modelInstance
   *
   * @return {Object}
   */
  static $getRowJSON (modelInstance) {
    return modelInstance.toObject()
  }

  static $getRowJSONIndexed (key, modelInstance) {
    const json = Serializer.$getRowJSON(modelInstance)
    return ({ [json[key]]: json }) // See https://gitlab.com/Rich-Harris/buble/issues/182
  }

  /**
   * Add row to the list of rows. Make sure the row
   * is an instance of the same model as the other
   * model instances.
   *
   * @method addRow
   *
   * @param  {Model}  row  - JSON row
   */
  addRow (row) {
    this.$rows.push(row)
  }

  /**
   * Get first model instance.
   *
   * @return {Model}
   */
  first () {
    return this.$rows[0]
  }

  /**
   * Get last model instance.
   *
   * @return {Model}
   */
  last () {
    return this.$rows[this.$rows.length - 1]
  }

  /**
   * Returns the size of rows.
   *
   * @return {Number}
   */
  size () {
    return this.$isOne ? 1 : this.$rows.length
  }

  getMetadata () {
    return this.$meta
  }

  toJSONIndexed (key = 'no') {
    if (this.$isOne) {
      return Serializer.$getRowJSONIndexed(key, this.$rows)
    }

    const indexed = {}

    this.$rows.forEach((row) => {
      Object.assign(indexed, Serializer.$getRowJSONIndexed(key, row))
    })

    return indexed
  }

  /**
   * Convert all rows/model instances to their JSON
   * representation.
   *
   * @return {Array|Object}
   */
  toJSON () {
    if (this.$isOne) {
      return Serializer.$getRowJSON(this.$rows)
    }

    return this.$rows.map(Serializer.$getRowJSON.bind(this))
  }
}

export default Serializer
