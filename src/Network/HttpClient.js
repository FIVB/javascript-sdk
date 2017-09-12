/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

// TODO : Change Object.assign() to { ...object, xxx } when available in Rollup
// TODO : See https://github.com/rollup/rollup/issues/1623

import fetch, { Headers } from 'node-fetch'
import Config from '../Core/Config'

class HttpClient {
  /**
   * Constructor.
   *
   * @constructor
   * @param  {Object}  options  - Options to use for the request
   */
  constructor (options = {}) {
    const headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/xml',
      'X-FIVB-App-ID': Config.appId,
    })

    this.$options = Object.assign({}, options, {
      headers,
      method: 'POST',
    })
  }

  /**
   * Sends the given request to the webservice.
   *
   * @param  {string}         param.body     - Request to send
   * @param  {Object[]|null}  param.headers  - Configuration for this request
   *
   * @return Promise
   */
  send ({ body, headers }) {
    const usedOptions = this.$options

    if (headers !== void 0) {
      headers.forEach((header) => {
        usedOptions.headers.set(header.name, header.value)
      })
    }

    if (Config.debug) {
      console.info(`[REQUEST] - ${body}`)
    }

    return new Promise((resolve, reject) => {
      let status

      fetch(`${Config.hostname}/vis2009/XmlRequest.asmx`, Object.assign({}, usedOptions, { body }))
        .then((response) => {
          status = response.ok
          return response.text()
        })
        .then((response) => {
          if (status === false) {
            if (Config.debug) {
              console.trace(response)
            }

            throw Error(response)
          }

          if (response !== '') {
            resolve(response)
          }

          resolve(true)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }
}

export default HttpClient
