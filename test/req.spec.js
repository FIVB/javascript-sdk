/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

const test = require('japa')
const req = require('../dist/fivb').req

test.group('Helpers | req', () => {
  test('should return the query', (assert) => {
    const query = req`<Request Type="GetTesting" No="1" />`

    assert.equal(query(), '<Request Type="GetTesting" No="1" />')
  })

  test('should interpolate variable into the query', (assert) => {
    const query = req`<Request Type="GetTesting" No="$no" />`
    const computedQuery = query({ no: 1 })

    assert.equal(computedQuery, '<Request Type="GetTesting" No="1" />')
  })

  test('should interpolate html using safe filter', (assert) => {
    const query = req`
      <Request Type="GetTesting" No="1">
        $filters:safe
      </Request>
    `

    const computedQuery = query({ filters: '<Filter Hello="World" />'})

    assert.equal(computedQuery, `
      <Request Type="GetTesting" No="1">
        <Filter Hello="World" />
      </Request>
    `)
  })
})
