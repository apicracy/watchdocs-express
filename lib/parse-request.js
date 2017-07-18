const sanitizeArray = data => data.map(value => typeof(value)).slice(0, 1)

const sanitize = (data) => {
  if(!data) return {};

  const keys = Object.keys(data)

  return keys.reduce((accumulator, current) => {
    const value = data[current]
    const valueType = typeof(value)
    let content;

    if (Array.isArray(value)) {
      content = sanitizeArray(value)
    } else if (valueType === 'object' && !value) {
      content = 'null'
    } else if (valueType === 'object') {
      content = sanitize(value)
    } else {
      content = valueType
    }

    return Object.assign({}, accumulator, { [current]: content })
  }, {})
}

module.exports = ({ path, method, body }) => {

  return {
    endpoint: path,
    request: {
      method: method,
      body: sanitize(body),
      query_string_params: { id: "string" }
    }
  }
}
