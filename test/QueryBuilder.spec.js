/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

const test = require('japa')
const QueryBuilder = require('../dist/fivb').QueryBuilder

test.group('Database | QueryBuilder', () => {
  test('should create a find query with the correct type', (assert) => {
    const query = new QueryBuilder('Testing')

    assert.equal(query.find(1), '<Request Type="GetTesting" No="1"></Request>')
  })

  test('should create a find query with relation', (assert) => {
    const query = new QueryBuilder('Testing')

    query.with('Testing')

    assert.equal(query.find(1), '<Request Type="GetTesting" No="1"><Relation Name="Testing"/></Request>')
  })

  test('should create a find query with specific fields', (assert) => {
    const query = new QueryBuilder('Testing')

    assert.equal(query.find(1, ['No', 'Testing']), '<Request Type="GetTesting" No="1" Fields="No Testing"></Request>')
  })

  test('should create a fetch query with the correct type', (assert) => {
    const query = new QueryBuilder('Testing')

    assert.equal(query.fetch(), '<Request Type="GetTestingList"></Request>')
  })

  test('should create a fetch query with specific fields', (assert) => {
    const query = new QueryBuilder('Testing')

    assert.equal(query.fetch(['No', 'Test']), '<Request Type="GetTestingList" Fields="No Test"></Request>')
  })

  test('should create a fetch query with specific filter', (assert) => {
    const query = new QueryBuilder('Testing')

    query.filterBy('TestingFilter', 'TestValue')

    assert.equal(query.fetch(), '<Request Type="GetTestingList"><Filter TestingFilter="TestValue"/></Request>')
  })

  test('should create a fetch query with specific relation', (assert) => {
    const query = new QueryBuilder('Testing')

    query.with('Test')

    assert.equal(query.fetch(), '<Request Type="GetTestingList"><Relation Name="Test"/></Request>')
  })

  test('should create a fetch query with specific fields of relation', (assert) => {
    const query = new QueryBuilder('Testing')

    query.with('Test', ['No', 'Testing'])

    assert.equal(query.fetch(), '<Request Type="GetTestingList"><Relation Name="Test" Fields="No Testing"/></Request>')
  })

  test('should create a fetch query with specific nested relation', (assert) => {
    const query = new QueryBuilder('Testing')

    query.with('Test')
    query.with('Test.Testing')

    assert.equal(query.fetch(), '<Request Type="GetTestingList"><Relation Name="Test"><Relation Name="Testing"/></Relation></Request>')
  })

  test('should create a fetch query with specific fields nested relation', (assert) => {
    const query = new QueryBuilder('Testing')

    query.with('Test')
    query.with('Test.Testing', ['No', 'Testing'])

    assert.equal(query.fetch(), '<Request Type="GetTestingList"><Relation Name="Test"><Relation Name="Testing" Fields="No Testing"/></Relation></Request>')
  })

  test('should create a fetch query with version', (assert) => {
    const query = new QueryBuilder('Testing')

    assert.equal(query.fetch(undefined, 1), '<Request Type="GetTestingList" Version="1"></Request>')
  })
})
