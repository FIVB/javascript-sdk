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
const HttpClient = require('../src/Network/HttpClient').default

class TestModel extends Model {
  static get $name () { return 'TestModel' }
}

test.group('Model', (group) => {
  group.beforeEach(() => {
    sinon.stub(HttpClient.prototype, 'send')
  })

  group.afterEach(() => {
    HttpClient.prototype.send.restore()
  })

  test('should generate the query to get one model', (assert) => {
    TestModel.find(1)

    assert.equal(HttpClient.prototype.send.args[0][0].body, '<Request Type="GetTestModel" No="1"></Request>')
  })

  test('should generate the query to get one model with given fields', (assert) => {
    TestModel.find(1, ['No'])

    assert.equal(HttpClient.prototype.send.args[0][0].body, '<Request Type="GetTestModel" No="1" Fields="No"></Request>')
  })

  test('should generate the query to get many models', (assert) => {
    TestModel.all()

    assert.equal(HttpClient.prototype.send.args[0][0].body, '<Request Type="GetTestModelList" Fields="No"></Request>')
  })

  test('should generate the query with given fields', (assert) => {
    TestModel.all(['Name', 'Age'])

    assert.equal(HttpClient.prototype.send.args[0][0].body, '<Request Type="GetTestModelList" Fields="Name Age"></Request>')
  })

  test('should generate the query with the given version', (assert) => {
    TestModel.all(['No'], 10)

    assert.equal(HttpClient.prototype.send.args[0][0].body, '<Request Type="GetTestModelList" Fields="No" Version="10"></Request>')
  })
})
