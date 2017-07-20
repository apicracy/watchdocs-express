const R = require('ramda')
const { parseRequest, parseResponse, parseEndpointUrl } = require('./lib/parsers')
const { generateReport } = require('./lib/reports')
const { validateOptions, responseDecorator } = require('./lib/utils')

const DEFAULT_OPTIONS = {
  appId: null,
  appSecret: null,
  host: 'https://watchdocs-api.herokuapp.com/api/v1/reports',
  batchSize: 10
}

const watchdocs = (_options) => {
  const options = Object.assign({}, DEFAULT_OPTIONS, _options)
  const isConfigured = validateOptions(options)

  if (!isConfigured) {
    console.error(`
\x1b[31m[Watchdocs.io]:\x1b[0m * Watchdocs.io express middleware error *
\x1b[31m[Watchdocs.io]:\x1b[0m * ************************************* *
\x1b[31m[Watchdocs.io]:\x1b[0m * It seems your middleware configuration is invalid
\x1b[31m[Watchdocs.io]:\x1b[0m * Please check if appId and appSecret fields are specified
\x1b[31m[Watchdocs.io]:\x1b[0m * For more inforamtion please see readme.md:
\x1b[31m[Watchdocs.io]:\x1b[0m * https://github.com/kkalamarski/watchdocs-express
    `)

    /* silently fail, allowing application to continue, but disabling recording endpoint calls */
    return (req, res, next) => {
      next && next()
      return false
    }
  }

  console.log(`
\x1b[32m[Watchdocs.io]:\x1b[0m * Watchdocs.io middleware is listening for api calls *
  `)

  /* return middleware function */
  return (req, res, next) => {
    res.send = responseDecorator(res.send)
    res.json = responseDecorator(res.json)

    res.on('finish', () => {
      const requestData = parseRequest(req)
      const responseData = parseResponse(res)
      const endpointData = parseEndpointUrl(req)

      const report = Object.assign({},
        endpointData,
        requestData,
        responseData
      )

      console.log(`
\x1b[32m[Watchdocs.io]:\x1b[0m * Registered call to [${requestData.request.method.toUpperCase()}] ${report.endpoint} *
      `)
      res.report = report
      generateReport(report, options)
    })

    next && next()
    return true
  }
}

module.exports = watchdocs
