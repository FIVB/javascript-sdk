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
   * @param  {string}         name    - Name of the relation
   * @param  {Array<string>}  fields  - Specific fields to retrieve
   *
   * @return {this}
   */
  with (name, fields) {
    const relations = this.$relations.get()
    relations.set(name, fields)

    return this
  }

  /**
   * Filters your request with given parameters.
   *
   * @param  {string}  name  - Name of the filter
   * @param  {string}  value - Value of the filter
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
   * @param  {number}       key            - Specific key to search for
   * @param  {string[]}     fields  - Specific fields to retrieve
   *
   * @return {Promise<Model>}
   */
  find (key, fields) {
    const client = new HttpClient()
    const request = new Request({ type: `Get${this.$getResourceName()}` })

    request.setAttribute({ name: 'No', value: key })

    if (fields !== void 0) {
      request.setAttribute({ name: 'Fields', value: fields.join(' ') })
    }

    if (this.$relations.get().size > 0) {
      request.setRelations(this.$relations.pull())
    }

    return new Promise((resolve, reject) => {
      client.send({ body: request.toString() })
        .then((response) => {
          const row = JSON.parse(response).data
          const modelInstance = this.$mapRowToInstance(row)
          resolve(new this.$model.Serializer(modelInstance, true))
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  /**
   * Fetches the resource.
   *
   * @param  {string[]}     fields   - Specific fields to retrieve
   * @param  {number|null}  version  - Version to use for the query
   *
   * @return {Promise<Model[]>}
   */
  fetch (fields = ['No'], version = 0) {
    const client = new HttpClient()
    const request = new Request({ type: `Get${this.$getResourceName()}List` })

    request.setAttribute({ name: 'Fields', value: fields.join(' ') })
    request.setAttribute({ name: 'Version', value: version })

    if (this.$relations.get().size > 0) {
      request.setRelations(this.$relations.pull())
    }

    if (this.$filters.get().size > 0) {
      request.setFilters(this.$filters.pull())
    }

    return new Promise((resolve, reject) => {
      client.send({ body: request.toString() })
        .then((response) => {
          const rows = JSON.parse(response).data
          const modelInstances = this.$mapRowsToInstances(rows)
          resolve(new this.$model.Serializer(modelInstances))
        })
        .catch((e) => {
          reject(e)
        })
    })
  }
}

export default QueryBuilder
