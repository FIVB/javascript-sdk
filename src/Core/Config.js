/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

let $config = {
  appId: null,
  debug: null,
  accessToken: null,
  hostname: 'https://www.fivb.org',
}

class Config {
  static get appId () { return $config.appId }
  static set appId (value) { $config.appId = value }

  static get debug () { return $config.debug }
  static set debug (value) { $config.debug = value }

  static get accessToken () { return $config.accessToken }
  static set accessToken (value) { $config.accessToken = value }

  static get hostname () { return $config.hostname }
  static set hostname (value) { $config.hostname = value }

  static use (config) {
    $config = Object.assign({}, $config, config)
  }
}

export default Config
