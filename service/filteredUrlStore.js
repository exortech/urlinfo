
module.exports = class FilteredUrlStore {
  constructor (urlFilter, urlStore) {
    this.filter = urlFilter
    this.store = urlStore
  }

  fetch (url) {
    return this.filter.has(url).then(filterResult => {
      if (!filterResult) {
        return null
      }
      return this.store.fetch(url)
    })
  }

  put (url, info) {
    return this.filter.add(url).then(() => {
      return this.store.put(url, info)
    })
  }
}
