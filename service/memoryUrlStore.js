const UrlInfo = require('./urlinfo')

const store = new Map()

module.exports.fetch = url => {
  return Promise.resolve(store.get(url.host + url.path) || store.get(url.host))
}

module.exports.put = (url, info) => {
  store.set(url, new UrlInfo(url, info))
  return Promise.resolve()
}

module.exports.clear = () => {
  store.clear()
}
