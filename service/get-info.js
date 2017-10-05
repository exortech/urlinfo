'use strict'
const URL = require('url')
const urlStore = require('./memoryUrlStore')

const makeResponse = function (statusCode, message, input) {
  return {
    statusCode,
    body: JSON.stringify({
      message,
      input
    })
  }
}

module.exports.handler = (event, context, callback) => {
  if (!event || !event.pathParameters || !event.pathParameters.proxy) {
    return callback(null, makeResponse(400, 'url is missing'))
  }
  const url = URL.parse('//' + event.pathParameters.proxy, true, true)

  urlStore.fetch(url).then(urlInfo => {
    if (urlInfo && urlInfo.isMalware()) {
      return callback(null, makeResponse(403, 'url is malware: ' + urlInfo.url, event))
    }
    callback(null, makeResponse(200, 'url is valid: ' + event.pathParameters.proxy, event))
  })
}
