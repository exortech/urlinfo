module.exports = class UrlInfo {
  constructor (url, info) {
    this.url = url
    this.info = info || {}
  }

  isMalware () {
    return !!this.info.malware
  }

  shouldBlock () {
    return !!this.info.threat
  }
}
