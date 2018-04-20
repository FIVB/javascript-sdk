/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import Request from '../Core/Request'

class Auth {
  /**
   * Attempts to retrieve a JSON Web Token
   * with given credentials.
   *
   * @static
   * @param  {string}  username  - Username of the user
   * @param  {string}  password  - Password of the user
   *
   * @return {string}
   */
  static attempt (username: string, password: string): string {
    const request = new Request('GetJsonWebToken')

    request.addAttribute('Username', username)
    request.addAttribute('Password', password)

    return request.toString()
  }

  /**
   * Logout the user.
   *
   * @static
   * @param  {string|undefined}  accessToken  - Token to use for the validation
   *
   * @return {string}
   */
  static logout (accessToken?: string): string {
    const request = new Request('LogOut')

    if (accessToken) {
      request.addAttribute('Token', accessToken)
    }

    return request.toString()
  }

  /**
   * Validates the given accessToken.
   *
   * @static
   * @param  {string|undefined}  accessToken  - Token to use for the validation
   *
   * @return {string}
   */
  static validateToken (accessToken?: string): string {
    const request = new Request('CheckJsonWebToken')

    if (accessToken) {
      request.addAttribute('Token', accessToken)
    }

    return request.toString()
  }

  /**
   * Retrieves a new accessToken with the given refreshToken.
   *
   * @static
   * @param  {string}  refreshToken  - Token to use to refresh
   *
   * @return {string}
   */
  static refreshToken (refreshToken: string): string {
    const request = new Request('GetJsonWebToken')

    request.addAttribute('RefreshToken', refreshToken)

    return request.toString()
  }
}

export default Auth
