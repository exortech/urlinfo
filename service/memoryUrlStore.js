
class UrlInfo {
  constructor (url, info) {
    this.url = url
    this.info = info || {}
  }

  isMalware () {
    return !!this.info.malware
  }
}

const store = {}

module.exports.fetch = url => {
  return Promise.resolve(store[url])
}

module.exports.put = (url, info) => {
  store[url] = new UrlInfo(url, info)
  return Promise.resolve()
}
