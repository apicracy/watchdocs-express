const { sanitize } = require('./utils')

const parseRequest = ({ method, body, query }) => ({
  request: {
    method: method,
    body: sanitize(body),
    query_string_params: sanitize(query)
  }
})
exports.parseRequest = parseRequest

const parseResponse = ({ statusCode, _getData }) => ({
  response: {
    status: statusCode,
    body: sanitize(_getData())
  }
})
exports.parseResponse = parseResponse
