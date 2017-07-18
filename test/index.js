const should = require('should')
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
require('should-sinon')

const wd = require('../index.js')

describe('Watchdocs Express.js', () => {
  describe('#wd() - config function', () => {
    it('should return valid express.js middleware function', () => {
      (wd(12345, 123456)).should.be.a.Function()
    })
  })

  describe('reading data from req object', () => {
    let watchdocs;

    before(() => {
      watchdocs = wd('12345', 'app-secret')
    })

    it('should invoke next callback', () => {
      const next = sinon.spy()
      const req = httpMocks.createRequest()
      const res = httpMocks.createResponse()


      watchdocs(req, res, next)

      res.send(1)
      next.should.be.calledOnce()
    })

    it('should contain correct endpoint path', () => {
      const req = httpMocks.createRequest({
        url: '/users/:id'
      })
      const res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      })

      watchdocs(req, res)
      res.send(1)

      res._isEndCalled().should.equal(true)
      res.should.have.property('report').which.is.an.Object()
      res.report.should.have.property('endpoint').which.is.a.String()
      res.report.endpoint.should.equal('/users/:id')
    })
  })
})
