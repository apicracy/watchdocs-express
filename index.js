const R = require('ramda')
const { parseRequest, parseResponse, parseEndpointUrl } = require('./lib/parsers')
const { generateReport } = require('./lib/reports')
const { validateOptions } = require('./lib/utils')

const DEFAULT_OPTIONS = {
  appId: null,
  appSecret: null,
  host: 'https://watchdocs-api.herokuapp.com/api/v1/reports',
  reportDirectory: '/temp'
}

const watchdocs = (_options) => {
  const options = Object.assign({}, DEFAULT_OPTIONS, _options)
  const isConfigured = validateOptions(options)

  if (!isConfigured) {
    console.error(`
      * Watchdocs.io express middleware error *
      * It seems your middleware configuration is invalid
      * Please check if appId and appSecret fields are specified
      * For more inforamtion please see readme.md:
      * https://github.com/kkalamarski/watchdocs-express
    `)

    /* silently fail, allowing application to continue, but disabling recording endpoint calls */
    return (req, res, next) => {
      next && next()
      return false
    }
  }

  /* return middleware function */
  return (req, res, next) => {

    res.on('end', chunk => {
      const requestData = parseRequest(req)
      const responseData = parseResponse(res)
      const endpointData = parseEndpointUrl(req)

      const report = Object.assign({},
        endpointData,
        requestData,
        responseData
      )

      res.report = report
      generateReport(report, options)
    })

    next && next()
    return true
  }
}

module.exports = watchdocs
