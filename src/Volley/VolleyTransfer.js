/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import Model from '../ORM/Model'
import Request from '../Network/Request'
import HttpClient from '../Network/HttpClient'

class VolleyTransfer extends Model {
  /**
   * Returns the name of the resource to fetch.
   * This is used instead of the class name
   * because it can be mangled while using
   * a minifier.
   *
   * @return {string}
   */
  static get $name () {
    return 'VolleyTransfer'
  }

  static sign (id, type) {
    const client = new HttpClient()
    const request = new Request('SignVolleyTransfer')

    request.addAttribute('No', id)
    request.addAttribute('SignatureType', type)

    return client.send({ body: request.toString() })
  }
}

export default VolleyTransfer
