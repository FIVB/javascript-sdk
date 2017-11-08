/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

const test = require('japa')
const { Request } = require('../dist/sdk.cjs')

test.group('Request', () => {

  test('should use the given type', (assert) => {
    const request = new Request({ type: 'TestingType' })

    assert.equal(request.toString(), '<Request Type="TestingType"></Request>')
  })

  test('should wrap when asked', (assert) => {
    const request = new Request({ type: 'TestingType', wrapped: true })

    assert.equal(request.toString(), '<Requests><Request Type="TestingType"></Request></Requests>')
  })

})
