const redis = require('redis')
const bloom = require('bloom-redis')
const { promisify } = require('util')

const createFilter = (size, numHashes, key) => {
  const client = redis.createClient()
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
    return filter.adding(url).then(result => {
      filter.client.quit()
      return result
    })
  }

  has (url) {
    const filter = createFilter(this.size, this.hashes, this.key)
    return Promise.all([
      filter.having(url.host),
      filter.having(url.host + url.path)
    ]).then(results => {
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
