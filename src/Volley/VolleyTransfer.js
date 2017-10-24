/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import Model from '../ORM/Model'
import Player from '../Player/Player'

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

  static get $relations () {
    return {
      player: Player,
    }
  }
}

export default VolleyTransfer
