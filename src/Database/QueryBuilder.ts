/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

// eslint-disable-next-line no-unused-vars
import Request, { RelationOptionsInterface } from '../Core/Request'

class QueryBuilder {
  private $name: string

  private $filters = new Map<string, string|number>()

  private $relations = new Map<string, RelationOptionsInterface>()

  constructor (name: string) {
    this.$name = name
  }

  $registerNestedRelation (name: string, options: RelationOptionsInterface): this {
    const [parentName, childName] = name.split('.')
    const parentOptions = this.$relations.get(parentName)

    this.$relations.set(parentName, {
      ...parentOptions,
      $relations: [
        Request.createRelation(childName, options),
      ],
    })

    return this
  }

  /**
   * Add a relation to the query.
   *
   * @param  {string}    name      - Name of the relation
   * @param  {string[]}  fields    - Specific fields to retrieve
   *
   * @return {this}
   */
  with (name: string, fields: string[]|undefined): this {
    if (name.indexOf('.') !== -1) {
      return this.$registerNestedRelation(name, { fields })
    }

    this.$relations.set(name, { fields })

    return this
  }

  /**
   * Filters your request with given parameters.
   *
   * @param  {string}  name   - Name of the filter
   * @param  {string}  value  - Value of the filter
   *
   * @return {this}
   */
  filterBy (name: string, value: string): this {
    this.$filters.set(name, value)

    return this
  }

  /**
   * Returns a record for given parameters.
   *
   * @param  {number}    key     - Specific key to search for
   * @param  {string[]}  fields  - Specific fields to retrieve
   *
   * @return {string}
   */
  find (key: number, fields?: string[]): string {
    const request = new Request(`Get${this.$name}`)

    request.addAttribute('No', key)

    if (fields !== undefined) {
      request.addAttribute('Fields', fields.join(' '))
    }

    if (this.$relations.size > 0) {
      Array.from(this.$relations).forEach(([name, f]) => {
        request.addRelation(name, f)
      })
    }

    return request.toString()
  }

  /**
   * Fetches the resource.
   *
   * @param  {string[]}  fields   - Specific fields to retrieve
   * @param  {number}    version  - Version to use for the query
   *
   * @return {string}
   */
  fetch (fields?: string[], version?: number) {
    const request = new Request(`Get${this.$name}List`)

    if (fields) {
      request.addAttribute('Fields', fields.join(' '))
    }

    if (version && version !== 0) {
      request.addAttribute('Version', version)
    }

    if (this.$relations.size > 0) {
      Array.from(this.$relations).forEach(([name, options]) => {
        request.addRelation(name, options)
      })
    }

    if (this.$filters.size > 0) {
      Array.from(this.$filters).forEach(([name, value]) => {
        request.addFilter(name, value)
      })
    }

    return request.toString()
  }
}

export default QueryBuilder
