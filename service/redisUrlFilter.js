const redis = require('redis')
const bloom = require('bloom-redis')
const promisify = require('util-promisify')

const createFilter = (size, numHashes, key) => {
  const options = {
    host: process.env.REDIS_HOST || '127.0.0.1'
  }
  const client = redis.createClient(options)
  const filter = new bloom.BloomFilter({
    client,
    size,
    numHashes,
    key
  })
  filter.adding = promisify(filter.add)
  filter.having = promisify(filter.contains)
  filter.clearing = promisify(filter.clear)
  return filter
}

module.exports = class RedisUrlFilter {
  constructor (size = 10000, hashes = 3, key = 'urlFilter') {
    this.size = size
    this.hashes = hashes
    this.key = key
  }

  add (url) {
    const filter = createFilter(this.size, this.hashes, this.key)
    console.log(`Adding ${url} to Redis filter`)
    return filter.adding(url).then(result => {
      console.log(`Added ${url} to Redis filter`)
      filter.client.quit()
      return result
    })
  }

  has (url) {
    const filter = createFilter(this.size, this.hashes, this.key)
    const urls = [url.host]
    if (url.path) {
      urls.push(url.host + url.path)
    }
    console.log(`Checking Redis filter for ${urls}`)
    return Promise.all(urls.map(u => filter.having(u))).then(results => {
      filter.client.quit()
      return results[0] || results[1]
    })
  }

  clear (url) {
    const filter = createFilter(this.size, this.hashes, this.key)
    return filter.clearing().then(result => {
      filter.client.quit()
      return result
    })
  }
}
