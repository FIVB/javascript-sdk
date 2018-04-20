/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

class Request {
  /**
   * Type of the request
   */
  private $type: string

  /**
   * Filters used in the request
   */
  private $filters = new Map<string, string|number>()

  /**
   * Relations used in the request
   */
  private $relations = new Map<string, RelationOptionsInterface>()

  /**
   * Attributes used in the request
   */
  private $attributes = new Map<string, string|number>()

  /**
   * Constructor.
   *
   * @constructor
   * @param  {string}  type - Type of the request
   */
  constructor (type: string) {
    this.$type = type
  }

  /**
   * Syntax helper to create a relation.
   *
   * @param  {string}                    name     - Name of the relation
   * @param  {RelationOptionsInterface}  options  - Options of the relation
   *
   * @return {RelationInterface}
   */
  static createRelation (name: string, options: RelationOptionsInterface): RelationInterface {
    return {
      key: name,
      fields: options.fields,
      $relations: options.$relations,
    }
  }

  /**
   * Adds an attribute in the request.
   *
   * @param  {string}         name   - Name of the attribute
   * @param  {string|number}  value  - Value of the attribute
   *
   * @return {this}
   */
  addAttribute (name: string, value: string|number): this {
    this.$attributes.set(name, value)

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
  addFilter (name: string, value: string | number): this {
    this.$filters.set(name, value)

    return this
  }

  /**
   * Adds a relation to the request.
   *
   * @param  {string}             name     - Name of the relation
   * @param  {RelationOptionsInterface}  options  - Options of the relation
   *
   * @return {this}
   */
  addRelation (name: string, options: RelationOptionsInterface): this {
    this.$relations.set(name, options)

    return this
  }

  /**
   * Transforms filters map to valide XML element.
   *
   * @return {string}
   */
  $filtersToString (): string {
    return `<Filter ${Array.from(this.$filters, ([key, value]) => `${key}="${value}"`).join(' ')}/>`
  }

  /**
   * Transforms one relation to valide XML elements.
   *
   * @return {string}
   */
  $relationToString (key: string, options: RelationInterface|RelationOptionsInterface): string {
    const { fields, $relations } = options
    let request = `<Relation Name="${key}"${fields ? ` Fields="${fields.join(' ')}"` : ''}`

    if ($relations) {
      request += '>'

      // eslint-disable-line no-shadow
      request += $relations.map(({ key, fields, $relations }) => (
        this.$relationToString(key, { fields, $relations })
      )).join('')

      request += '</Relation>'

      return request
    }

    request += '/>'

    return request
  }

  /**
   * Transforms relations map to valide XML elements.
   *
   * @return {string}
   */
  $relationsToString (): string {
    return Array.from(this.$relations, ([key, options]) => (
      this.$relationToString(key, options)
    )).join('')
  }

  /**
   * Convert the request to string.
   *
   * @return {string}
   */
  toString (): string {
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

export interface RelationOptionsInterface {
  fields?: string[],
  $relations?: [RelationInterface],
}

export interface RelationInterface extends RelationOptionsInterface {
  key: string,
}

export default Request
