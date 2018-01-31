/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

require('babel-core/register')
require('reify')
const test = require('japa')
const sinon = require('sinon')
const fetchMock = require('fetch-mock')

const Model = require('../src/ORM/Model').default
const Serializer = require('../src/ORM/Serializer').default
const QueryBuilder = require('../src/ORM/QueryBuilder').default
const HttpClient = require('../src/Network/HttpClient').default

const GetTesting = require('./stubs/GetTesting.json')
const BadParameter = require('./stubs/BadParameter.json')
const GetTestingList = require('./stubs/GetTestingList.json')


class TestModel extends Model {
  static get $name () { return 'TestModel' }
}

let client = null
let query = null

test.group('QueryBuilder', (group) => {
  group.beforeEach(() => {
    client = sinon.stub(HttpClient.prototype, 'send')
    query = new QueryBuilder(TestModel)
  })

  group.afterEach(() => {
    client.restore()
  })

  test('should generate the query with given filter on fetch', async (assert) => {
      await query
        .filterBy('Test', 'Testing')
        .fetch()
        .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModelList" Fields="No"><Filter Test="Testing"/></Request>' }))
  })

  test('should generate the query with given filters on fetch', async (assert) => {
    await query
      .filterBy('Test', 'Testing')
      .filterBy('Test2', 'Testing2')
      .fetch()
      .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModelList" Fields="No"><Filter Test="Testing" Test2="Testing2"/></Request>' }))
  })

  test('should generate the query with given relations on fetch', async (assert) => {
    await query
      .with('Test', ['No'])
      .filterBy('Test', 'Testing')
      .filterBy('Test2', 'Testing2')
      .fetch()
      .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModelList" Fields="No"><Filter Test="Testing" Test2="Testing2"/><Relation Name="Test" Fields="No"/></Request>' }))
  })

  test('should generate the query with given relations without any fields on fetch', async (assert) => {
    await query
      .with('Test')
      .fetch()
      .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModelList" Fields="No"><Relation Name="Test"/></Request>' }))
  })

  test('should generate the query with given relations on find', async (assert) => {
    await query
      .with('Test', ['No'])
      .find(1)
      .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModel" No="1"><Relation Name="Test" Fields="No"/></Request>' }))
  })

  test('should generate the query with nested relations on find', async (assert) => {
    await query
      .with('Test.Testing')
      .find(1)
      .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModel" No="1"><Relation Name="Test"><Relation Name="Testing"/></Relation></Request>' }))
  })

  test('should generate the query with nested relations and fields on find', async (assert) => {
    await query
      .with('Test.Testing', ['No'])
      .find(1)
      .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModel" No="1"><Relation Name="Test"><Relation Name="Testing" Fields="No"/></Relation></Request>' }))
  })

    test('should generate the query with nested relations and fields on find', async (assert) => {
    await query
      .with('Test', ['Name'])
      .with('Test.Testing', ['No'])
      .find(1)
      .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModel" No="1"><Relation Name="Test" Fields="Name"><Relation Name="Testing" Fields="No"/></Relation></Request>' }))
  })


  test('should generate the query with nested relations on fetch', async (assert) => {
    await query
      .with('Test.Testing')
      .fetch()
      .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModelList" Fields="No"><Relation Name="Test"><Relation Name="Testing"/></Relation></Request>' }))
  })

  test('should generate the query with given relations without any fields on find', async (assert) => {
    await query
      .with('Test')
      .find(1)
      .catch(() => {})

    assert.isTrue(client.calledWith({ body: '<Request Type="GetTestModel" No="1"><Relation Name="Test"/></Request>' }))
  })

  test('should instantiate a Serializer with WS response on fetch', async (assert) => {
    client.returns(GetTestingList)

    const serializer = await query.filterBy('Test', 'Testing').fetch()

    assert.instanceOf(serializer, Serializer)
  })

  test('should instantiate a Serializer with WS response on find', async (assert) => {
    client.returns(GetTesting)

    const serializer = await query.find(1)

    assert.instanceOf(serializer, Serializer)
  })

  test('should throw an error if the request is incorect on fetch', async (assert) => {
    fetchMock.post('*', { body: BadParameter, status: 400 })

    try {
      await query.fetch()
      assert.isTrue(false)
    } catch (e) {
      assert.deepEqual(e, BadParameter)
    }

    fetchMock.restore()
  })

  test('should throw an error if the request is incorect on find', async (assert) => {
    fetchMock.post('*', { body: BadParameter, status: 400 }, { overrideRoutes: true })

    try {
      await query.find(1)
      assert.isTrue(false)
    } catch (e) {
      assert.deepEqual(e, BadParameter)
    }

    fetchMock.restore()
  })
})
