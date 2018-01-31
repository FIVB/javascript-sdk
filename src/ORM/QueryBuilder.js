/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import Resetable from 'resetable'
import Request from '../Network/Request'
import HttpClient from '../Network/HttpClient'

class QueryBuilder {
  /**
   * Constructor.
   *
   * @constructor
   * @param  {Model}  model  - Model to use to query
   */
  constructor (model) {
    this.$model = model
    this.$filters = new Resetable(new Map())
    this.$relations = new Resetable(new Map())
  }

  /**
   * Gets the resource name.
   *
   * @return  {string}
   */
  $getResourceName () {
    return this.$model.$name
  }

  /**
   *
   */
  $mapRowToInstance (row) {
    return new this.$model(row)
  }

  /**
   *
   */
  $mapRowsToInstances (rows) {
    return rows.map(row => this.$mapRowToInstance(row))
  }

  /**
   * Add a relation to the query.
   *
   * @param  {string}    name      - Name of the relation
   * @param  {string[]}  fields    - Specific fields to retrieve
   *
   * @return {this}
   */
  with (name, fields) {
    if (name.indexOf('.') !== -1) {
      return this.$registerNestedRelation(name, fields)
    }

    const relations = this.$relations.get()
    relations.set(name, { fields })

    return this
  }

  $registerNestedRelation (name, nestedFields = null) {
    const relations = this.$relations.get()
    const [parent, nested] = name.split('.')

    const parentFields = relations.get(parent)
    relations.set(parent, {
      fields: parentFields ? parentFields.fields : undefined,
      nested: [
        {
          name: nested,
          fields: nestedFields,
        },
      ],
    })

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
  filterBy (name, value) {
    const filters = this.$filters.get()
    filters.set(name, value)

    return this
  }

  /**
   * Returns a record for given parameters.
   *
   * @param  {number}    key     - Specific key to search for
   * @param  {string[]}  fields  - Specific fields to retrieve
   *
   * @return {Promise<Model>}
   */
  async find (key, fields) {
    const client = new HttpClient()
    const request = new Request(`Get${this.$getResourceName()}`)

    request.addAttribute('No', key)

    if (fields !== void 0) {
      request.addAttribute('Fields', fields.join(' '))
    }

    if (this.$relations.get().size > 0) {
      Array.from(this.$relations.pull()).forEach(([name, f]) => {
        request.addRelation(name, f)
      })
    }

    try {
      const response = await client.send({ body: request.toString() })
      const row = response.data
      const modelInstance = this.$mapRowToInstance(row)

      return new this.$model.Serializer(modelInstance, {}, true)
    } catch (e) {
      throw e
    }
  }

  /**
   * Fetches the resource.
   *
   * @param  {string[]}     fields   - Specific fields to retrieve
   * @param  {number|null}  version  - Version to use for the query
   *
   * @return {Promise<Model[]>}
   */
  async fetch (fields = ['No'], ver = 0) {
    const client = new HttpClient()
    const request = new Request(`Get${this.$getResourceName()}List`)

    request.addAttribute('Fields', fields.join(' '))

    if (ver !== 0) {
      request.addAttribute('Version', ver)
    }

    if (this.$relations.get().size > 0) {
      Array.from(this.$relations.pull()).forEach(([name, f]) => {
        request.addRelation(name, f)
      })
    }

    if (this.$filters.get().size > 0) {
      Array.from(this.$filters.pull()).forEach(([name, value]) => {
        request.addFilter(name, value)
      })
    }

    try {
      const response = await client.send({ body: request.toString() })
      const { data, nbItems, version } = response
      const modelInstances = this.$mapRowsToInstances(data)

      return new this.$model.Serializer(modelInstances, { nbItems, version })
    } catch (e) {
      throw e
    }
  }
}

export default QueryBuilder
