const should = require('should')
const parseRequest = require('../lib/parse-request.js')

describe('#parseRequest()', function() {

  it('is a function', function() {
    parseRequest.should.be.a.Function()
  })

  it('should set correct endpoint url', function() {
    const testReq = {
      path: '/users'
    }

    parseRequest(testReq).endpoint.should.be.exactly('/users')
  })

  it('should set correct http method', function() {
    const _req = {
      method: 'POST'
    }

    const _req2 = {
      method: 'DELETE'
    }

    parseRequest(_req).request.method.should.be.exactly(_req.method)
    parseRequest(_req2).request.method.should.be.exactly(_req2.method)
  })

  it('should replace all values with type string', function() {
    const _req = {
      body: {
        name: 'Krzysztof',
        age: 25,
        address: {
          city: 'Wroclaw',
          'zip-code': '54-123',
          street: 'Rynek',
          flat: 10,
          names: ['Anna', 'Marek', 'Teodor']
        },
        IBAN: 'AL47 2121 1009 0000 0002 3569 8741',
        hobbies: ['skating', 'creating decent apis', 'hiking'],
        isAdmin: false,
        nullField: null
      }
    }

    const parsed = parseRequest(_req).request.body

    parsed.name.should.equal('string')
    parsed.age.should.equal('number')
    parsed.isAdmin.should.equal('boolean')
    parsed.should.have.property('hobbies').which.is.an.Array()
    parsed.hobbies.should.deepEqual(['string'])
    parsed.nullField.should.equal('null')

    parsed.should.have.property('address').which.is.an.Object()
    parsed.address.flat.should.equal('number')
    parsed.address['zip-code'].should.equal('string')

    parsed.address.should.have.property('names').which.is.an.Array()
    parsed.address.names.should.deepEqual(['string'])

  })


})
