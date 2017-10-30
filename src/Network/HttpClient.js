/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

// TODO : Change Object.assign() to { ...object, xxx } when available in Rollup
// TODO : See https://github.com/rollup/rollup/issues/1623

import 'isomorphic-fetch'
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

    if (Config.accessToken !== null) {
      headers.append('Authorization', `Bearer ${Config.accessToken}`)
    }

    this.$options = Object.assign({}, options, {
      headers,
      method: 'POST',
      cache: 'no-store',
      mode: 'cors',
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
            throw Error(response)
          }

          if (response !== '') {
            resolve(response)
          }

          resolve(true)
        })
        .catch((e) => {
          try {
            reject(JSON.parse(e.message))
          } catch (l) {
            reject(e.message)
          }
        })
    })
  }
}

export default HttpClient
