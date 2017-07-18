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
      next.should.be.calledOnce()
    })
  })
})
