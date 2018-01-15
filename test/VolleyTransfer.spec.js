/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

require('buble/register')
require('reify')
const test = require('japa')
const sinon = require('sinon')
const HttpClient = require('../src/Network/HttpClient').default
const VolleyTransfer = require('../src/Volley/VolleyTransfer').default

test.group('VolleyTransfer', (group) => {
  group.beforeEach(() => {
    sinon.stub(HttpClient.prototype, 'send')
  })

  group.afterEach(() => {
    HttpClient.prototype.send.restore()
  })

  test('should be able to sign a transfer', async (assert) => {
    VolleyTransfer.sign(1, 'FederationTo')

    assert.equal(HttpClient.prototype.send.args[0][0].body, '<Request Type="SignVolleyTransfer" No="1" SignatureType="FederationTo"></Request>')
  })
})
