module.exports = class UrlInfo {
  constructor (url, info) {
    this.url = url
    this.info = info || {}
  }

  shouldBlock () {
    return !!this.info.threat
  }
}
