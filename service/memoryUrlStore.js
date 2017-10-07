const UrlInfo = require('./urlInfo')

module.exports = class MemoryUrlStore {
  constructor () {
    this.store = new Map()
  }

  fetch (url) {
    return Promise.resolve(this.store.get(url.host + url.path) || this.store.get(url.host))
  }

  put (url, info) {
    this.store.set(url, new UrlInfo(url, info))
    return Promise.resolve()
  }
}
