const dynalite = require('dynalite')
const AWS = require('aws-sdk')

const port = 4567
const dynamoConfig = {
  region: 'localhost',
  endpoint: 'http://localhost:' + port
}
const dynamodb = new AWS.DynamoDB(dynamoConfig)

const dynamoUrlStore = new (require('../service/dynamoDbUrlStore'))(dynamoConfig)
const memoryUrlFilter = new (require('../service/memoryUrlFilter'))()
const urlStore = new (require('../service/filteredUrlStore'))(memoryUrlFilter, dynamoUrlStore)

const tableName = dynamoUrlStore.tableName()

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
  return urlStore.put(url, { url, threat })
}

const dynaliteServer = dynalite({ createTableMs: 0 })
dynaliteServer.listen(port, function (err) {
  if (err) {
    throw err
  }
  console.log('Dynalite started on port', port)

  return createTable().then(() => {
    return Promise.all([
      putItem('malware.com:80/page.html', 'fishing'),
      putItem('malwaredomain.com:80', 'virus'),
      putItem('malwarestore.com:443/store?item=got.torrent', 'worm')
    ])
  }).catch(err => console.error(err))
})
