const R = require('ramda')
const { parseRequest, parseResponse, parseEndpointUrl } = require('./lib/parsers')

const watchdocs = ({ appId, appSecret }) => (req, res, next) => {

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
  })

  next && next()
}

module.exports = watchdocs
