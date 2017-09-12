/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import Request from '../Network/Request'
import HttpClient from '../Network/HttpClient'

class Auth {
  /**
   * Attempts to retrieve a JSON Web Token
   * with given credentials.
   *
   * @static
   * @param  {string}  param.username  - Username of the user
   * @param  {string}  param.password  - Password of the user
   *
   * @return {Promise}
   */
  static attempt ({ username, password }) {
    const client = new HttpClient()
    const request = new Request({ type: 'GetJsonWebToken' })

    request.setAttributes([
      { name: 'Username', value: username },
      { name: 'Password', value: password },
    ])

    return new Promise((resolve, reject) => {
      client.send({ body: request.toString() })
        .then(response => resolve(response))
        .catch(e => reject(e))
    })
  }

  /**
   * Validates the given accessToken.
   *
   * @static
   * @param  {string}  param.accessToken  - Token to use for the validation
   *
   * @return {Promise}
   */
  static validateSession ({ accessToken }) {
    const client = new HttpClient()
    const request = new Request({ type: 'CheckJsonWebToken' })

    return new Promise((resolve, reject) => {
      client.send({
        body: request.toString(),
        headers: [
          { name: 'Authorization', value: `Bearer ${accessToken}` },
        ],
      })
        .then(response => resolve(response))
        .catch(e => reject(e))
    })
  }

  /**
   * Retrieves a new accessToken with the given refreshToken.
   *
   * @static
   * @param  {string}  param.refreshToken  - Token to use to refresh
   *
   * @return {Promise}
   */
  static refreshSession ({ refreshToken }) {
    const client = new HttpClient()
    const request = new Request({ type: 'GetJsonWebToken' })

    request.setAttribute({ name: 'RefreshToken', value: refreshToken })

    return new Promise((resolve, reject) => {
      client.send({ body: request.toString() })
        .then(response => resolve(response))
        .catch(e => reject(e))
    })
  }
}

export default Auth
