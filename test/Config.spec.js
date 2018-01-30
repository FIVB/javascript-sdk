/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

require('babel-core/register')
require('reify')
const test = require('japa')
const Config = require('../src/Core/Config').default

test.group('Config', () => {
  test('should have appId default configuration', (assert) => {
    assert.isNull(Config.appId)
  })

  test('should have debug default configuration', (assert) => {
    assert.isFalse(Config.debug)
  })

  test('should have accessToken default configuration', (assert) => {
    assert.isNull(Config.accessToken)
  })

  test('should have hostname default configuration', (assert) => {
    assert.equal(Config.hostname, 'https://www.fivb.org')
  })

  test('should be able to use a config object', (assert) => {
    Config.use({ hostname: 'testing' })

    assert.equal(Config.hostname, 'testing')
  })

  test('should be able to use a config object multiple time', (assert) => {
    Config.use({ hostname: 'testing' })
    Config.use({ debug: true })

    assert.equal(Config.hostname, 'testing')
    assert.isTrue(Config.debug)
  })

  test('should be able to set directly configuration', (assert) => {
    Config.hostname = 'test'
    Config.debug = false
    Config.accessToken = 'test'
    Config.appId = 'test'


    assert.equal(Config.hostname, 'test')
    assert.equal(Config.accessToken, 'test')
    assert.equal(Config.appId, 'test')
    assert.isFalse(Config.debug)
  })
})
