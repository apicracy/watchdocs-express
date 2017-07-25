const { isJSON, sanitizeArray, sanitize, objToArray } = require('../lib/utils')

describe('Utility functions', () => {
  describe('#isJSON()', () => {
    it('should return true for all valid json strings', () => {
      isJSON(JSON.stringify({ test: 2 })).should.equal(true)
      isJSON('test').should.equal(false)
      isJSON(JSON.stringify(null)).should.equal(false)
    })
  })

  describe('#sanitizeArray()', () => {
    it('should parse array of other primitive types', () => {
        sanitizeArray(['test', 'test', 'test2']).should.deepEqual(['string'])
    })

    it('should parse array of nuls', () => {
        sanitizeArray([null, null, null]).should.deepEqual(['null'])
    })

    it('should parse nested arrays', () => {
      sanitizeArray([
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ]).should.deepEqual([['number']])
    })
  })

  describe('#sanitize()', () => {
    it('should parse json string and sanitise its properties', () => {
      const json = JSON.stringify({ test: 'kittens', nested: [ 'yeah' ]})

      const sanitized = sanitize(json)

      sanitized.should.not.equal('string')
      sanitized.should.have.property('test').which.is.a.String()
      sanitized.test.should.equal('string')
    })

    it('should return empty object if no data is passed', () => {
      sanitize().should.deepEqual({})
    })
  })

  describe('#objToArray()', () => {
    it('should convert object to array', () => {
      objToArray({ name: 'test', test: 'name' }).should.be.an.Array()
    })

    it('should handle invalid data type', () => {
      objToArray().should.be.an.Array();
      objToArray(null).should.be.an.Array();
    })
  })
})
