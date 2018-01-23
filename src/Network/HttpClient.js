/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

// TODO : Change Object.assign() to { ...object, xxx } when available in Rollup
// TODO : See https://github.com/rollup/rollup/issues/1623

import 'isomorphic-unfetch'
import Config from '../Core/Config'

class HttpClient {
  /**
   * Constructor.
   *
   * @constructor
   * @param  {Object}  options  - Options to use for the request
   */
  constructor (options = {}) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/xml',
      'X-FIVB-App-ID': Config.appId,
    }

    if (Config.accessToken !== null) {
      headers.Authorization = `Bearer ${Config.accessToken}`
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
   * @param  {string}              param.body     - Request to send
   * @param  {Object[]|undefined}  param.headers  - Configuration for this request
   *
   * @return Promise
   */
  async send ({ body, headers }) {
    const usedOptions = this.$options

    if (headers !== void 0) {
      usedOptions.headers = Object.assign(usedOptions.headers, headers)
    }

    if (Config.debug) {
      // eslint-disable-next-line no-console
      console.info(`[REQUEST] - ${body}`)
    }

    const response = await fetch(`${Config.hostname}/vis2009/XmlRequest.asmx`, Object.assign({}, usedOptions, { body }))
    const responseBody = await response.text()

    if (!response.ok) {
      throw JSON.parse(responseBody)
    }

    if (responseBody !== '') {
      return JSON.parse(responseBody)
    }

    return true
  }
}

export default HttpClient
