/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

require('babel-core/register')
require('reify')
const test = require('japa')
const Request = require('../src/Network/Request').default

test.group('Request', () => {
  test('should use the given type', (assert) => {
    const request = new Request('TestingType')

    assert.equal(request.toString(), '<Request Type="TestingType"></Request>')
  })

  test('should be able to set attribute', (assert) => {
    const request = new Request('TestingType')
    request.addAttribute('Test', 'Testing')

    assert.equal(request.toString(), '<Request Type="TestingType" Test="Testing"></Request>')
  })

  test('should be able to set multiple attributes', (assert) => {
    const request = new Request('TestingType')
    request.addAttributes({
      Test: 'Testing',
      Test2: 'Testing2',
    })

    assert.equal(request.toString(), '<Request Type="TestingType" Test="Testing" Test2="Testing2"></Request>')
  })

  test('should be able to add filter', (assert) => {
    const request = new Request('TestingType')
    request.addFilter('Test', 'Testing')

    assert.equal(request.toString(), '<Request Type="TestingType"><Filter Test="Testing"/></Request>')
  })

  test('should be able to add multiple filters', (assert) => {
    const request = new Request('TestingType')
    request.addFilters({
      Test: 'Testing',
      Test2: 'Testing2',
    })

    assert.equal(request.toString(), '<Request Type="TestingType"><Filter Test="Testing" Test2="Testing2"/></Request>')
  })

  test('should be able to add relation', (assert) => {
    const request = new Request('TestingType')
    request.addRelation('Test', { fields: ['No'] })

    assert.equal(request.toString(), '<Request Type="TestingType"><Relation Name="Test" Fields="No"/></Request>')
  })

  test('should be able to add relation without fields', (assert) => {
    const request = new Request('TestingType')
    request.addRelation('Test')

    assert.equal(request.toString(), '<Request Type="TestingType"><Relation Name="Test"/></Request>')
  })
})
