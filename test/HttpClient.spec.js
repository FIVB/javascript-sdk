/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

require('babel-core/register')
require('reify')
const test = require('japa')
const fetchMock = require('fetch-mock')
const Config = require('../src/Core/Config').default
const Request = require('../src/Network/Request').default
const HttpClient = require('../src/Network/HttpClient').default

const GetTesting = require('./stubs/GetTesting.json')
const BadParameter = require('./stubs/BadParameter.json')

test.group('HttpClient', (group) => {
  group.before(() => {
    Config.debug = true
  })

  group.afterEach(() => {
    fetchMock.restore()
  })

  test('should return the response of the server', async (assert) => {
    fetchMock.post('*', GetTesting)

    const request = new Request('GetVolleyMatch')
    const client = new HttpClient()

    assert.deepEqual(await client.send({ body: request.toString() }), GetTesting)
  })

  test('should return the error when web service fail', async (assert) => {
    fetchMock.post('*', { body: BadParameter, status: 400 })

    const request = new Request('IHaveABadType')
    const client = new HttpClient()

    try {
      await client.send({ body: request.toString() })
    } catch (e) {
      assert.deepEqual(e, BadParameter)
    }
  })
})

