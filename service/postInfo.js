'use strict'

const URL = require('url')
const DynamoDbUrlStore = require('./dynamoDbUrlStore')

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
  const urlStore = context.store || new DynamoDbUrlStore()

  if (!event || !event.pathParameters || !event.pathParameters.proxy) {
    return callback(null, makeResponse(400, 'url is missing'))
  }
  const url = event.pathParameters.proxy
  const info = JSON.parse(event.body)

  console.log(`Storing url ${url} with info ${JSON.stringify(info)}`)
  urlStore.put(url, info).then(result => {
    callback(null, makeResponse(200, 'info has been stored for: ' + event.pathParameters.proxy, event))
  }).catch(err => {
    console.error(err)
    callback(err)
  })
}
