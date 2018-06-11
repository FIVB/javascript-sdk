/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

const test = require('japa')
const Request = require('../dist/cjs/Core/Request').default

test.group('Core | Request', () => {
  test('should use the given type', (assert) => {
    const request = new Request('TestingType')

    assert.equal(request.$type, 'TestingType')
  })

  test('should be able to add attribute', (assert) => {
    const request = new Request('TestingType')

    request.addAttribute('Test', 'Testing')

    assert.equal(request.$attributes.size, 1)
  })

  test('should be able to add multiple attributes', (assert) => {
    const request = new Request('TestingType')

    request.addAttribute('Test', 'Testing')
      .addAttribute('Test2', 'Testing2')

    assert.equal(request.$attributes.size, 2)
  })

  test('should be able to add filter', (assert) => {
    const request = new Request('TestingType')

    request.addFilter('Test', 'Testing')

    assert.equal(request.$filters.size, 1)
  })

  test('should be able to convert filter to string', (assert) => {
    const request = new Request('TestingType')

    request.addFilter('Test', 'Testing')

    assert.equal(request.$filtersToString(), '<Filter Test="Testing"/>')
  })

  test('should be able to add multiple filters', (assert) => {
    const request = new Request('TestingType')

    request.addFilter('Test', 'Testing')
      .addFilter('Test2', 'Testing2')

    assert.equal(request.$filters.size, 2)
  })

  test('should be able to convert multiple filters to string', (assert) => {
    const request = new Request('TestingType')

    request.addFilter('Test', 'Testing')
      .addFilter('Test2', 'Testing2')

    assert.equal(request.$filtersToString(), '<Filter Test="Testing" Test2="Testing2"/>')
  })

  test('should be able to add relation', (assert) => {
    const request = new Request('TestingType')

    request.addRelation('Test', { fields: ['No'] })

    assert.equal(request.$relations.size, 1)
  })

  test('should be able to convert relation to string', (assert) => {
    const request = new Request('TestingType')

    request.addRelation('Test', { fields: ['No'] })

    assert.equal(request.$relationsToString(), '<Relation Name="Test" Fields="No"/>')
  })

  test('should be able to add multiple relations', (assert) => {
    const request = new Request('TestingType')

    request.addRelation('Test', { fields: ['No'] })
      .addRelation('Test2', { fields: ['No'] })

    assert.equal(request.$relations.size, 2)
  })

  test('should be able to convert multiple relations to string', (assert) => {
    const request = new Request('TestingType')

    request.addRelation('Test', { fields: ['No'] })
      .addRelation('Test2', { fields: ['No'] })

    assert.equal(request.$relationsToString(), '<Relation Name="Test" Fields="No"/><Relation Name="Test2" Fields="No"/>')
  })

  test('should be able to add nested relation', (assert) => {
    const request = new Request('TestingType')

    request.addRelation('Test', {
      fields: ['No'],
      $relations: [
        Request.createRelation('Testing', ['No']),
      ],
    })

    assert.equal(request.$relations.size, 1)
    assert.equal(request.$relations.get('Test').$relations.length, 1)
  })

  test('should be able to convert nested relation to string', (assert) => {
    const request = new Request('TestingType')

    request.addRelation('Test', {
      fields: ['No'],
      $relations: [
        Request.createRelation('Testing', { fields: ['No'] }),
      ],
    })

    assert.equal(request.$relations.size, 1)
    assert.equal(request.$relationsToString(), '<Relation Name="Test" Fields="No"><Relation Name="Testing" Fields="No"/></Relation>')
  })

  test('should be able to convert multiple nested relation to string', (assert) => {
    const request = new Request('TestingType')

    request.addRelation('Test', {
      fields: ['No'],
      $relations: [
        Request.createRelation('Testing', { fields: ['No'] }),
        Request.createRelation('Testing2', { fields: ['No'] }),
      ],
    })

    assert.equal(request.$relations.size, 1)
    assert.equal(request.$relationsToString(), '<Relation Name="Test" Fields="No"><Relation Name="Testing" Fields="No"/><Relation Name="Testing2" Fields="No"/></Relation>')
  })

  test('should be able to convert nested of nested relation to string', (assert) => {
    const request = new Request('TestingType')

    request.addRelation('Test', {
      fields: ['No'],
      $relations: [
        Request.createRelation('Testing', {
          fields: ['No'],
          $relations: [Request.createRelation('Testing2', { fields: ['No'] })],
        }),
      ],
    })

    assert.equal(request.$relations.size, 1)
    assert.equal(request.$relationsToString(), '<Relation Name="Test" Fields="No"><Relation Name="Testing" Fields="No"><Relation Name="Testing2" Fields="No"/></Relation></Relation>')
  })

  test('should convert a request to a string', (assert) => {
    const request = new Request('TestingType')

    request.addAttribute('Fields', ['No'])
    request.addFilter('Test', 'Testing')
    request.addRelation('Test', {
      fields: ['No'],
      $relations: [
        Request.createRelation('Testing', {
          fields: ['No'],
          $relations: [Request.createRelation('Testing2', { fields: ['No'] })],
        }),
      ],
    })

    assert.equal(request.toString(), '<Request Type="TestingType" Fields="No"><Filter Test="Testing"/><Relation Name="Test" Fields="No"><Relation Name="Testing" Fields="No"><Relation Name="Testing2" Fields="No"/></Relation></Relation></Request>')
  })
})
