const should = require('should')
const { parseRequest } = require('../lib/parsers')
const httpMocks = require('node-mocks-http')

const wd = require('../index.js')

describe('Parsing data', () => {
  before(() => {
    watchdocs = wd('12345', 'app-secret')
  })

  describe('#parseRequest() - Request parser', function() {

    it('is a function', function() {
      parseRequest.should.be.a.Function()
    })

    it('should set correct http method', function() {
      const req = httpMocks.createRequest({
        method: 'POST'
      })

      const req2 = httpMocks.createRequest({
        method: 'DELETE'
      })

      parseRequest(req).request.method.should.be.exactly('POST')
      parseRequest(req2).request.method.should.be.exactly('DELETE')
    })

    it('should replace all body values with type string', function() {
      const req = httpMocks.createRequest({
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
      })

      const parsed = parseRequest(req).request.body

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

  // Response parser
  describe('#parseRequest() - Response Parser', () => {
    let req, res

    beforeEach(() => {
      req = httpMocks.createRequest()
      res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      })
    })

    it('should read response from the server', () => {
      watchdocs(req, res)
      res.status(200).json(2)

      res.report.should.have.property('response')
    })

    it('should set correct response code', () => {
      watchdocs(req, res)

      res.status(500).send('Error')
      res.report.response.status.should.equal(500)
    })
  })
})
