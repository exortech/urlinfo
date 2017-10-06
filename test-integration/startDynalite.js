const dynalite = require('dynalite')
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB({
  region: 'localhost',
  endpoint: 'http://localhost:4567'
})
const tableName = 'urlInfo'

const createTable = function () {
  console.log('Creating DynamoDB table:', tableName)
  return dynamodb.createTable({
    TableName: tableName,
    AttributeDefinitions: [
      {
        AttributeName: 'url',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'url',
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }).promise().then(() => {
    return dynamodb.describeTable({ TableName: tableName }).promise()
  })
}

const putItem = function (url, threat = 'malware') {
  console.log(`Writing '${url} - ${threat}' to ${tableName}`)
  return dynamodb.putItem({
    TableName: tableName,
    Item: {
      url: { S: url },
      threat: { S: threat },
      discovered_ts: { S: new Date().toISOString() },
      scanned_ts: { S: new Date().toISOString() }
    }
  }).promise()
}

const dynaliteServer = dynalite({ createTableMs: 0 })
dynaliteServer.listen(4567, function (err) {
  if (err) {
    throw err
  }
  console.log('Dynalite started on port 4567')

  return createTable().then(() => {
    return Promise.all([
      putItem('malware.com:80/page.html', 'fishing'),
      putItem('malwaredomain.com:80', 'virus'),
      putItem('malwarestore.com:443/store?item=got.torrent', 'worm')
    ])
  }).catch(err => console.error(err))
})
