const { CuckooFilter } = require('bloom-filters')

module.exports = class MemoryUrlFilter {
  constructor (size = 1000, fingerprintSize = 3, bucketSize = 2) {
    this.filter = new CuckooFilter(size, fingerprintSize, bucketSize)
  }

  add (url) {
    return Promise.resolve(this.filter.add(url))
  }

  has (url) {
    return Promise.resolve(this.filter.has(url.host + url.path) || this.filter.has(url.host))
  }

  remove (url) {
    return Promise.resolve(this.filter.remove(url))
  }
}
