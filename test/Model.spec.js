/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

require('babel-core/register')
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

  test('should be able to be instantiated without any attributes', (assert) => {
    const model = new TestModel()

    assert.deepEqual(model.$attributes, {})
    assert.deepEqual(model.$original, {})
  })

  test('should sync attributes when instantiated', (assert) => {
    const model = new TestModel({ name: 'Romain Lanz' })

    assert.equal(model.$attributes.name, 'Romain Lanz')
    assert.equal(model.$original.name, 'Romain Lanz')
  })

  test('should fill the attributes', (assert) => {
    const model = new TestModel({ name: 'Romain Lanz' })

    model.fill({ name: 'FIVB' })

    assert.equal(model.$attributes.name, 'FIVB')
    assert.equal(model.$original.name, 'Romain Lanz')
  })

  test('should sync the attributes with originals when requested', (assert) => {
    const model = new TestModel({ name: 'Romain Lanz' })

    model.fill({ name: 'FIVB' })
    model.$syncOriginal()

    assert.equal(model.$attributes.name, 'FIVB')
    assert.equal(model.$original.name, 'FIVB')
  })

  test('should returns the attributes', (assert) => {
    const model = new TestModel({ name: 'Romain Lanz' })

    assert.deepEqual(model.toObject(), { name: 'Romain Lanz' })
  })

  test('should returns the attributes serialized', (assert) => {
    const model = new TestModel({ name: 'Romain Lanz' })

    assert.deepEqual(model.toJSON(), { name: 'Romain Lanz' })
  })

  test('should be able to return an instance of the querybuilder', (assert) => {
    const query = TestModel.query()

    assert.equal(query.constructor.name, 'QueryBuilder')
  })

  test('should be able to return an instance of the Serializer', (assert) => {
    const serializer = TestModel.Serializer

    assert.equal(serializer.name, 'Serializer')
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
