const should = require('should')
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
require('should-sinon')

const wd = require('../index.js')

describe('Watchdocs Express.js', () => {
  describe('#wd() - config function', () => {
    let req, res

    before(() => {
      req = httpMocks.createRequest()
      res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      })
    })

    it('should be valid express.js middleware function', () => {
      (wd({})).should.be.a.Function()
    })

    it('should silently fail if not configured', () => {
      wd()(req, res).should.equal(false)
      wd({})(req, res).should.equal(false)

      wd({ appId: '1', appSecret: '1'})(req, res).should.equal(true)
    })
  })

  describe('reading data from req object', () => {
    let watchdocs;

    before(() => {
      watchdocs = wd({
        appId: '12345',
        appSecret: '1234567-secret'
      })
    })

    it('should invoke next callback', () => {
      const next = sinon.spy()
      const req = httpMocks.createRequest()
      const res = httpMocks.createResponse()


      watchdocs(req, res, next)

      res.send('test')
      next.should.be.calledOnce()
    })

    it('should contain correct endpoint path', () => {
      const req = httpMocks.createRequest({
        url: '/users/25',
        params: {
          id: '25'
        }
      })
      const res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      })

      watchdocs(req, res)
      res.send('kittens!')

      res._isEndCalled().should.equal(true)
      res.should.have.property('report').which.is.an.Object()
      res.report.should.have.property('endpoint').which.is.a.String()
      res.report.endpoint.should.equal('/users/:id')
    })
  })
})
