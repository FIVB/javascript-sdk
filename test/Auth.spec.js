/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

const test = require('japa')
const Auth = require('../dist/cjs/Service/Auth').default

test.group('Service | Auth', () => {
  test('should create the correct request to attempt an auth', (assert) => {
    assert.equal(Auth.attempt('John', 'Doe'), '<Request Type="GetJsonWebToken" Username="John" Password="Doe"></Request>')
  })

  test('should create the correct request to logout a user', (assert) => {
    assert.equal(Auth.logout(), '<Request Type="LogOut"></Request>')
  })

  test('should create the correct request to logout a user', (assert) => {
    assert.equal(Auth.logout(), '<Request Type="LogOut"></Request>')
  })

  test('should create the correct request to logout a user with a token', (assert) => {
    assert.equal(Auth.logout('USER_TOKEN'), '<Request Type="LogOut" Token="USER_TOKEN"></Request>')
  })

  test('should create the correct request to validate a token', (assert) => {
    assert.equal(Auth.validateToken(), '<Request Type="CheckJsonWebToken"></Request>')
  })

  test('should create the correct request to validate a token with a token', (assert) => {
    assert.equal(Auth.validateToken('USER_TOKEN'), '<Request Type="CheckJsonWebToken" Token="USER_TOKEN"></Request>')
  })

  test('should create the correct request to refresh a token', (assert) => {
    assert.equal(Auth.refreshToken('USER_TOKEN'), '<Request Type="GetJsonWebToken" RefreshToken="USER_TOKEN"></Request>')
  })
})
