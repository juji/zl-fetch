import createRequestOptions, { isFormData } from './createRequestOptions.js'
import { handleError, handleResponse } from './handleResponse.js'

/**
 * Main Fetch Function
 * @param {string} url - endpoint
 * @param {object} [options] - zlFetch options
 * @param {string} [options.method] - HTTP method
 * @param {object} [options.headers] - HTTP headers
 * @param {object} [options.body] - Body content
 * @param {string} [options.auth] - Authentication information
 * @param {string} [options.debug] - Logs the request options for debugging
 * @param {string} [options.returnError] - Returns the error instead of rejecting it
 * @param {string} [options.customResponseParser] - Use a custome response parser
 */

export function coreFetch(url, options) {
  return fetchInstance({ url, ...options||{} })
}
// ========================
// Internal Functions
// ========================
async function fetchInstance(options) {
  const requestOptions = createRequestOptions(options)

  // Remove options that are not native to a fetch request
  delete requestOptions.fetch
  delete requestOptions.queries
  delete requestOptions.query
  delete requestOptions.params
  delete requestOptions.param
  delete requestOptions.auth
  delete requestOptions.debug
  delete requestOptions.returnError

  // Performs the fetch request
  return fetch(requestOptions.url, requestOptions)
    .then(response => handleResponse(response, options))
    .then(response => {
      if (!options.debug) return response
      return { ...response, debug: debugHeaders(requestOptions) }
    })
    .catch(handleError)
}

function debugHeaders(requestOptions) {
  const clone = Object.assign({}, requestOptions)
  const headers = {}
  for (const [header, value] of clone.headers) {
    headers[header] = value
  }
  clone.headers = headers
  return clone
}

// so it will be captured by ts

coreFetch.get = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'get'
  })
}

coreFetch.post = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'post'
  })
}

coreFetch.put = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'put'
  })
}

coreFetch.patch = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'patch'
  })
}

coreFetch.delete = function (url, options) {
  return coreFetch(url, {
    ...options,
    method: 'delete'
  })
}
