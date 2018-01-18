/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import User from '../User/User'
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
   * @return {Promise<Object>}
   */
  static attempt (username, password) {
    const client = new HttpClient()
    const request = new Request('GetJsonWebToken')

    request.addAttributes({
      Username: username,
      Password: password,
    })

    return client.send({ body: request.toString() })
  }

  /**
   * Logout the user.
   *
   * @static
   * @param  {string}  accessToken  - Access token of the user to disconnect.
   *
   * @return {Promise<Object>}
   */
  static logout () {
    const client = new HttpClient()
    const request = new Request('LogOut')

    return client.send({ body: request.toString() })
  }

  /**
   * Validates the given accessToken.
   *
   * @static
   * @param  {string}  accessToken  - Token to use for the validation
   *
   * @return {Promise<Boolean>}
   */
  static validateToken (accessToken) {
    const client = new HttpClient()
    const request = new Request('CheckJsonWebToken')

    return client.send({
      body: request.toString(),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  /**
   * Retrieves a new accessToken with the given refreshToken.
   *
   * @static
   * @param  {string}  refreshToken  - Token to use to refresh
   *
   * @return {Promise<Object>}
   */
  static refreshToken (refreshToken) {
    const client = new HttpClient()
    const request = new Request('GetJsonWebToken')

    request.addAttribute('RefreshToken', refreshToken)

    return client.send({ body: request.toString() })
  }

  /**
   * Get the current logged in User.
   *
   * @static
   *
   * @return {User}
   */
  static async getUser () {
    const client = new HttpClient()
    const request = new Request('GetUser')

    const response = await client.send({ body: request.toString() })
    const user = new User(JSON.parse(response).data)

    return new User.Serializer(user, {}, true)
  }
}

export default Auth
