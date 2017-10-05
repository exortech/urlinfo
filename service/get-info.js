'use strict'
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
  const url = event.pathParameters.proxy

  urlStore.fetch(url).then(urlInfo => {
    if (urlInfo && urlInfo.isMalware()) {
      return callback(null, makeResponse(403, 'url is malware: ' + url, event))
    }
    callback(null, makeResponse(200, 'url is valid: ' + url, event))
  })
}
