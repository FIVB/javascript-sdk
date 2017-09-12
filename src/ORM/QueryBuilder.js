/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

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
    this.$filters = new Map()
  }

  /**
   * Gets the resource name.
   *
   * @return  {string}
   */
  $getResourceName () {
    // if (this.$model.resourceName !== null) {
    //   return this.$model.resourceName
    // }

    return this.$model.name
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

  find ({ key, fields, version }) {
    const headers = []
    const client = new HttpClient()
    const request = new Request({ type: `Get${this.$getResourceName()}` })

    request.setAttribute({ name: 'No', value: key })

    if (fields !== void 0) {
      request.setAttribute({ name: 'Fields', value: fields.join(' ') })
    }

    if (version !== void 0) {
      request.setAttribute({ name: 'Version', value: version })
    }

    if (this.$model.isXml === true) {
      headers.push({ name: 'Accept', value: 'application/xml' })
    }

    return new Promise((resolve, reject) => {
      client.send({
        body: request.toString({ wrapped: this.$model.isXml }),
        headers,
      })
        .then((response) => {
          if (this.$model.isXml === true) {
            resolve(new this.$model.Serializer(response, null, true))
          }

          const row = JSON.parse(response).data
          const modelInstance = this.$mapRowToInstance(row)
          resolve(new this.$model.Serializer(modelInstance, null, true))
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  /**
   * Fetches the resource.
   *
   * @param  {string[]}     param.fields   - Specific fields to retrieve
   * @param  {number|null}  param.version  - Version to use for the query
   *
   * @return {Promise}
   */
  fetch ({ fields, version }) {
    const headers = []
    const client = new HttpClient()
    const request = new Request({ type: `Get${this.$getResourceName()}List` })

    if (fields !== void 0) {
      request.setAttribute({ name: 'Fields', value: fields.join(' ') })
    }

    if (version !== void 0) {
      request.setAttribute({ name: 'Version', value: version })
    }

    if (this.$filters.size > 0) {
      // ...
    }

    if (this.$model.isXml === true) {
      headers.push({ name: 'Accept', value: 'application/xml' })
    }

    return new Promise((resolve, reject) => {
      client.send({
        body: request.toString({ wrapped: this.$model.isXml }),
        headers,
      })
        .then((response) => {
          if (this.$model.isXml === true) {
            resolve(new this.$model.Serializer(response))
          }

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
