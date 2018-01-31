/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

class Request {
  /**
   * Constructor.
   *
   * @constructor
   * @param  {string}    param.type     - Type of the request
   */
  constructor (type) {
    this.$type = type
    this.$filters = new Map()
    this.$relations = new Map()
    this.$attributes = new Map()
  }

  /**
   * Adds an attribute in the request.
   *
   * @param  {string}         name   - Name of the attribute
   * @param  {string|number}  value  - Value of the attribute
   *
   * @return {this}
   */
  addAttribute (name, value) {
    this.$attributes.set(name, value)

    return this
  }

  /**
   * Adds multiple attributes in the request.
   *
   * @param  {Object[]}  attributes  - Attributes to set in the request
   *
   * @return {this}
   */
  addAttributes (attributes) {
    Object.keys(attributes).forEach(name => this.addAttribute(name, attributes[name]))

    return this
  }

  /**
   * Adds a filter to the request.
   *
   * @param  {string}         name   - Name of the filter
   * @param  {string|number}  value  - Value of the filter
   *
   * @return {this}
   */
  addFilter (name, value) {
    this.$filters.set(name, value)

    return this
  }

  /**
   * Adds multiple filters to the request.
   *
   * @param  {Object[]}  filters  - Filters to add to the request
   *
   * @return {this}
   */
  addFilters (filters) {
    Object.keys(filters).forEach(name => this.addFilter(name, filters[name]))

    return this
  }

  /**
   * Adds a relation to the request.
   *
   * @param  {string}    name    - Name of the relation
   * @param  {string[]}  fields  - Fields to get
   *
   * @return {this}
   */
  addRelation (name, fields = { fields: undefined }) {
    this.$relations.set(name, fields)

    return this
  }

  $filtersToString () {
    return `<Filter ${Array.from(this.$filters, ([key, value]) => `${key}="${value}"`).join(' ')}/>`
  }

  $relationsToString () {
    return Array.from(this.$relations, ([key, value]) => {
      const { fields } = value

      if (value.nested) {
        let request = `<Relation Name="${key}"${fields ? ` Fields="${fields.join(' ')}"` : ''}>`
        const [{ name, fields: nestedFields }] = value.nested
        request += `<Relation Name="${name}"${nestedFields ? ` Fields="${nestedFields.join(' ')}"` : ''}/>`
        request += '</Relation>'

        return request
      }

      return `<Relation Name="${key}"${fields ? ` Fields="${fields.join(' ')}"` : ''}/>`
    }).join('')
  }

  /**
   * Computes the request.
   *
   * @return  {string}
   */
  toString () {
    let request = `<Request Type="${this.$type}"${this.$attributes.size > 0 ? ' ' : ''}${Array.from(this.$attributes, ([key, value]) => `${key}="${value}"`).join(' ').trim()}>`

    if (this.$filters.size > 0) {
      request += this.$filtersToString()
    }

    if (this.$relations.size > 0) {
      request += this.$relationsToString()
    }

    request += '</Request>'

    return request
  }
}

export default Request
