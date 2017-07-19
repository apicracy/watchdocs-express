const R = require('ramda')
const { parseRequest, parseResponse } = require('./lib/parsers')

const watchdocs = ({ appId, appSecret }) => (req, res, next) => {
  const endpointData = { endpoint: req.path }
  const requestData = parseRequest(req)

  res.on('end', chunk => {
    const responseData = parseResponse(res)
    const report = Object.assign({},
      endpointData,
      requestData,
      responseData
    )

    res.report = report
  })

  next && next()
}

module.exports = watchdocs
