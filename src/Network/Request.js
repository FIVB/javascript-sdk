/**
 * fivb-sdk 23 24 | 29
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

class Request {
  /**
   * Constructor.
   *
   * @constructor
   * @param  {string}    param.type  - Type of the request
   */
  constructor ({ type }) {
    this.$type = type
    this.$filters = new Map()
    this.$relations = new Map()
    this.$attributes = new Map()
  }

  /**
   * Sets an attribute in the request.
   *
   * @param  {string}         param.name   - Name of the attribute
   * @param  {string|number}  param.value  - Value of the attribute
   *
   * @return {void}
   */
  setAttribute ({ name, value }) {
    this.$attributes.set(name, value)
  }

  /**
   * Sets multiple attributes in the request.
   *
   * @param  {Object[]}  attributes  - Attributes to set in the request
   *
   * @return {void}
   */
  setAttributes (attributes) {
    attributes.forEach(attribute => this.setAttribute(attribute))
  }

  /**
   * Adds a filter to the request.
   *
   * @param  {string}         param.name   - Name of the filter
   * @param  {string|number}  param.value  - Value of the filter
   *
   * @return {void}
   */
  addFilter ({ name, value }) {
    this.$filters.set(name, value)
  }

  /**
   * Adds multiple filters to the request.
   *
   * @param  {Object[]}  filters  - Filters to add to the request
   */
  addFilters (filters) {
    filters.forEach(filter => this.addFilter(filter))
  }

  addRelations (relations) {
    relations.forEach(relation => this.addRelation(relation))
  }

  addRelation ({ name, fields }) {
    this.$relations.set(name, fields)
  }

  /**
   * Computes the request.
   *
   * @param  {boolean}  param.wrapped  - Defines if the request should be wrapped
   *                                     with <Requests></Requests>
   *
   * @return  {String}
   */
  toString ({ wrapped } = { wrapped: false }) {
    let request = `<Request Type="${this.$type}"${this.$attributes.size > 0 ? ' ' : ''}${Array.from(this.$attributes).map(([key, value]) => `${key}="${value}"`).join(' ').trim()}>`

    if (this.$filters.size > 0) {
      request += `<Filter ${Array.from(this.$filters).map(([key, value]) => `${key}="${value}"`).join(' ').trim()} />`
    }

    if (this.$relations.size > 0) {
      request += Array.from(this.$relations).map(([key, value]) => `<Relation Name="${key}" Fields="${value.join(' ')}" />`).join(' ')
    }

    request += '</Request>'

    if (wrapped === true) {
      return `<Requests>${request}</Requests>`
    }

    return request
  }
}

export default Request
