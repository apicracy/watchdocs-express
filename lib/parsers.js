const { sanitize, objToArray } = require('./utils')

const parseRequest = ({ method, body, query, params }) => ({
  request: {
    method,
    params,
    body: sanitize(body),
    query_string_params: sanitize(query)
  }
})
exports.parseRequest = parseRequest

const parseResponse = ({ statusCode, payload }) => ({
  response: {
    status: statusCode,
    body: sanitize(payload)
  }
})
exports.parseResponse = parseResponse

const parseEndpointUrl = req => {
  const originalUrl = req.url
  const params = objToArray(req.params)

  const endpoint = params.reduce((acc, current, array) => {
    return acc.replace(`/${current.value}`, `/:${current.key}`)
  }, originalUrl)

  return { endpoint }
}
exports.parseEndpointUrl = parseEndpointUrl
