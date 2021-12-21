// window.fetch response headers contains entries method.
const getBrowserFetchHeaders = response => {
  const headers = {}
  for (const [header, value] of response.headers.entries()) {
    headers[header] = value
  }
  return headers
}

// Node fetch response headers does not contain entries method.
const getNodeFetchHeaders = response => {
  const headers = {}
  const h = response.headers._headers
  for (const header in h) {
    headers[header] = h[header].join('')
  }
  return headers
}

const getHeaders = response => {
  return response.headers.entries
    ? getBrowserFetchHeaders(response)
    : getNodeFetchHeaders(response)
}

const formatOutput = (response, body) => {
  const headers = getHeaders(response)
  const returnValue = {
    body,
    headers,
    response,
    status: response.status,
    statusText: response.statusText
  }

  return response.ok
    ? Promise.resolve(returnValue)
    : Promise.reject(returnValue)
}

const parseResponse = (response, type) => {
  // This will do response.json(), response.text(), etc.
  // We use bracket notation to allow multiple types to be parsed at the same time.
  return response[type]().then(body => formatOutput(response, body))
}

export const handleResponse = response => {
  const type = response.headers.get('content-type')

  if (type.includes('json')) return parseResponse(response, 'json')
  if (type.includes('text')) return parseResponse(response, 'text')
  if (type.includes('image')) return parseResponse(response, 'blob')

  // Need to check for FormData, Blob and ArrayBuffer content types
  throw new Error(`zlFetch does not support content-type ${type} yet`)
}

/**
 * Formats all errors into zlFetch style error
 * @param {Object} error - The error object
 */
export const handleError = error => {
  if (error.message === 'Failed to fetch') {
    /* eslint-disable */
    return Promise.reject({ error })
    /* eslint-enable */
  }
  return Promise.reject(error)
}
