const isJSON = (string) => {
  try {
    const json = JSON.parse(string)

    if(json && typeof(json) === 'object') {
      return true
    }

    return false
  } catch(e) {
    return false
  }
}
exports.isJSON = isJSON

const sanitizeArray = data => data.map(value => {
  const dataType = typeof(value)

  if (Array.isArray(value)) {
    return sanitizeArray(array)
  } else if(dataType === 'object') {
    return !!value ? sanitize(value) : 'null'
  }

  return dataType
}).slice(0, 1)
exports.sanitizeArray = sanitizeArray

const sanitize = (data) => {
  if (!data) return {}

  const dataType = typeof(data)
  const isResponseJson = typeof(data) === 'string' && isJSON(data)

  if(isResponseJson) {
    return sanitize(JSON.parse(data))
  }

  if (dataType !== 'object') {
    return dataType
  } else if (Array.isArray(data)) {
    return sanitizeArray(data)
  }

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
exports.sanitize = sanitize


const objToArray = obj => Object.keys(obj).map(key => ({ key, value: obj[key] }))
exports.objToArray = objToArray

const validateOptions = options => {
  if (!options.appId || !options.appSecret) {
    return false
  }

  return true
}
exports.validateOptions = validateOptions
