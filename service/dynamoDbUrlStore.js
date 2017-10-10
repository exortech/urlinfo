const AWS = require('aws-sdk')
const UrlInfo = require('./urlInfo')

const urlStoreTable = process.env.DYNAMODB_TABLE || 'urlInfo'

module.exports = class DynamoDbUrlStore {
  constructor (awsConfig) {
    this.dynamodb = new AWS.DynamoDB.DocumentClient(awsConfig)
  }

  fetch (url) {
    const params = {
      RequestItems: {
        [urlStoreTable]: {
          Keys: [{
            url: url.host
          }]
        }
      }
    }
    if (url.path) {
      params.RequestItems[urlStoreTable].Keys.push({ url: url.host + url.path })
    }

    console.log('Checking DynamoDb:', params)
    return this.dynamodb.batchGet(params).promise().then(result => {
      if (result && result.Responses && result.Responses[urlStoreTable] && result.Responses[urlStoreTable].length) {
        const responses = result.Responses[urlStoreTable]
        // TODO: returning the first match - may be better to return most specific match
        return new UrlInfo(responses[0].url, responses[0])
      }
      return null
    })
  }

  put (url, info) {
    const putParams = {
      TableName: urlStoreTable,
      Item: {
        url,
        threat: info.threat,
        discovered_ts: info.discovered_ts || new Date().toISOString(),
        scanned_ts: info.scanned_ts || new Date().toISOString()
      }
    }
    console.log(`Storing ${url} in dynamo: ${JSON.stringify(putParams)}`)
    return this.dynamodb.put(putParams).promise().then(r => {
      console.log(`Stored ${url} in dynamo`)
      return r
    })
  }

  tableName () {
    return urlStoreTable
  }
}
