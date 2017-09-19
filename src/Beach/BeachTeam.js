/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import Model from '../ORM/Model'
import Player from '../Player/Player'

class BeachTeam extends Model {
  static get relations () {
    return {
      Player1: Player,
      Player2: Player,
      Substituted1: Player,
      Substituted2: Player,
    }
  }
}

export default BeachTeam
