const AWS = require('aws-sdk')
const UrlInfo = require('./urlInfo')

const urlStoreTable = 'urlInfo'
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:4567'
})

module.exports.fetch = url => {
  const params = {
    TableName: urlStoreTable,
    Key: {
      url: url.host + url.path
    }
  }

  return dynamodb.get(params).promise().then(result => {
    if (result && result.Item) {
      return new UrlInfo(result.Item.url, result.Item)
    }
    return null
  })
}
