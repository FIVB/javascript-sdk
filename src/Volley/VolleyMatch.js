/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import Model from '../ORM/Model'
import XMLSerializer from '../ORM/Serializers/XMLSerializer'

class VolleyMatch extends Model {
  /**
   * The serializer to be used for serializing
   * data. The return value must always be a
   * ES6 class.
   *
   * @return {Serializer}
   */
  static get Serializer () {
    return XMLSerializer
  }

  /**
   * Defines if the model use XML format.
   */
  static get isXml () {
    return true
  }
}

export default VolleyMatch
