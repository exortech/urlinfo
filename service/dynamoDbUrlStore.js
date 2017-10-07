const AWS = require('aws-sdk')
const UrlInfo = require('./urlInfo')

const urlStoreTable = process.env.DYNAMODB_TABLE || 'urlInfo'

module.exports = class DynamoDbUrlStore {
  constructor (awsConfig) {
    this.dynamodb = new AWS.DynamoDB.DocumentClient(awsConfig)
  }

  fetch (url) {
    const params = {
      TableName: urlStoreTable,
      Key: {
        url: url.host + url.path
      }
    }

    console.log(params)
    return this.dynamodb.get(params).promise().then(result => {
      if (result && result.Item) {
        return new UrlInfo(result.Item.url, result.Item)
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

    console.log(putParams)
    return this.dynamodb.put(putParams).promise()
  }
}
