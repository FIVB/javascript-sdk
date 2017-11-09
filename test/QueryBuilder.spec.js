/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

require('buble/register')
require('reify')
const test = require('japa')
const sinon = require('sinon')
const Model = require('../src/ORM/Model').default
const QueryBuilder = require('../src/ORM/QueryBuilder').default
const HttpClient = require('../src/Network/HttpClient').default

class TestModel extends Model {
  static get $name () { return 'TestModel' }
}

let query = null

test.group('QueryBuilder', (group) => {
  group.beforeEach(() => {
    sinon.stub(HttpClient.prototype, 'send')
    query = new QueryBuilder(TestModel)
  })

  group.afterEach(() => {
    HttpClient.prototype.send.restore()
  })

  test('should generate the query with given filter', (assert) => {
    query
      .filterBy('Test', 'Testing')
      .fetch()

    assert.equal(HttpClient.prototype.send.args[0][0].body, '<Request Type="GetTestModelList" Fields="No"><Filter Test="Testing"/></Request>')
  })

  test('should generate the query with given filters', (assert) => {
    query
      .filterBy('Test', 'Testing')
      .filterBy('Test2', 'Testing2')
      .fetch()

    assert.equal(HttpClient.prototype.send.args[0][0].body, '<Request Type="GetTestModelList" Fields="No"><Filter Test="Testing" Test2="Testing2"/></Request>')
  })
})
