'use strict'

const UrlInfo = require('./urlInfo')
const DynamoDbUrlStore = require('./dynamoDbUrlStore')
const RedisUrlFilter = require('./redisUrlFilter')
const FilteredUrlStore = require('./filteredUrlStore')

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
  const urlStore = context.store || new FilteredUrlStore(new RedisUrlFilter(), new DynamoDbUrlStore())

  if (!event || !event.pathParameters || !event.pathParameters.proxy) {
    return callback(null, makeResponse(400, 'url is missing'))
  }
  const url = UrlInfo.parseUrl(event.pathParameters.proxy, event.queryStringParameters)
  urlStore.fetch(url).then(urlInfo => {
    if (urlInfo && urlInfo.shouldBlock()) {
      return callback(null, makeResponse(403, 'url is malware: ' + urlInfo.url, event))
    }
    callback(null, makeResponse(200, 'url is valid: ' + url.requestedUrl, event))
  }).catch(err => {
    console.error(err)
    callback(err)
  })
}
