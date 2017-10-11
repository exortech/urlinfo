const URL = require('url')

module.exports = class UrlInfo {
  constructor (url, info) {
    this.url = url
    this.info = info || {}
  }

  shouldBlock () {
    return !!this.info.threat
  }

  static parseUrl (requestedPath, queryParams) {
    const queryString = queryParams ? Object.keys(queryParams).reduce((memo, k) => {
      return memo + (memo.length ? '&' : '?') + k + '=' + queryParams[k]
    }, '') : ''
    const url = URL.parse('//' + requestedPath + queryString, true, true)
    const requestedUrl = url.host + (url.path || '')
    return {
      requestedUrl,
      host: url.host,
      path: url.path
    }
  }
}
