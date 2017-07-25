const should = require('should')
const { parseRequest } = require('../lib/parsers')
const httpMocks = require('node-mocks-http')

const wd = require('../index.js')

describe('Parsing data', () => {
  before(() => {
    watchdocs = wd({
      appId: '12345',
      appSecret: 'app-secret'
    })
  })

  describe('#parseRequest() - Request parser', function() {

    it('is a function', function() {
      parseRequest.should.be.a.Function()
    })

    it('should set correct http method', function() {
      const req = httpMocks.createRequest({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
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
  describe('#parseResponse() - Response Parser', () => {
    let req, res

    beforeEach(() => {
      req = httpMocks.createRequest({
        headers: {
          'Content-Type': 'application/json',
        }
      })
      res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      })

      watchdocs(req, res)
    })

    it('should read response from the server', () => {
      res.status(200).json({ message: 'kittens!'})

      res.report.should.have.property('response')
    })

    it('should set correct response code', () => {
      res.status(500).json({ msg: 'Error!' })
      res.report.response.status.should.equal(500)
    })

    it('should read and parse response body', () => {
      res.json({ message: 'kittens!' })
      res.report.response.body.should.have.property('message')
      res.report.response.body.message.should.equal('string')
    })

    it('should abort when sent value is not valid JSON', () => {
      res.send('token')
      res.should.have.property('report').which.is.a.Null()
    })

    it('should correctly read string[] type', () => {
      res.json(['red', 'yellow', 'blue'])
      res.report.response.should.have.property('body').which.is.an.Array()
      res.report.response.body[0].should.equal('string')
    })

    it('should correctly read number[] type', () => {
      res.json([2, 3, 5, 7, 11, 13])
      res.report.response.should.have.property('body').which.is.an.Array()
      res.report.response.body[0].should.equal('number')
    })

    it('should correctly parse nested object structure', () => {
      res.json({
        name: 'Krzysztof',
        age: 55,
        address: {
          street: 'Rynek',
          zipCode: '54-134',
          city: {
            name: 'Wroclaw',
            voivodeship: 'dolny śląsk',
          }
        }
      })
      const { body } = res.report.response

      body.should.have.property('address').which.is.an.Object()
      body.address.should.have.property('city').which.is.an.Object()
      body.name.should.equal('string')
      body.age.should.equal('number')
      body.address.city.voivodeship.should.equal('string')
    })

    it('should correctly parse nested object[] structure', () => {
      res.json([
        { name: 'Krzysztof', hobbies: ['hiking', 'javascript'] },
        { name: 'Anna', hobbies: ['skating', 'painting'] },
        { name: 'Mark', hobbies: ['cooking', 'running', 'gym'] },
      ])

      const { body } = res.report.response

      body.should.be.an.Array()
      body.should.containEql({ name: 'string', hobbies: ['string'] })
    })

    it('should parse JSON structure', () => {
      res.json({ message: 'kittens!' })

      const { body } = res.report.response
      body.should.be.an.Object()
    })
  })
})
