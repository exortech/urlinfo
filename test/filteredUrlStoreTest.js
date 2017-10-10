import test from 'ava'
import URL from 'url'
import MemoryUrlFilter from '../service/memoryUrlFilter'
import MemoryUrlStore from '../service/memoryUrlStore'
import FilteredUrlStore from '../service/filteredUrlStore'

test('write to store also writes to filter', t => {
  const filter = new MemoryUrlFilter()
  const urlStore = new MemoryUrlStore()
  const store = new FilteredUrlStore(filter, urlStore)
  const url = 'filtereddomain:443/page.html'
  const info = { url, threat: 'virus' }
  return store.put(url, info).then(() => {
    const u = URL.parse('//' + url, true, true)
    return Promise.all([
      filter.has(url).then(r => t.true),
      urlStore.fetch(u).then(r => t.is(r.info, info))
    ])
  })
})

test('fetch checks filter', t => {
  const store = new FilteredUrlStore(new MemoryUrlFilter(), new MemoryUrlStore())
  const url = 'filtereddomain:443/page.html'
  const info = { url, threat: 'virus' }
  return store.put(url, info).then(() => {
    const u = URL.parse('//' + url, true, true)
    return store.fetch(u).then(r => {
      t.not(r, null)
      t.is(r.info, info)
    })
  })
})

test('fetch checks filter against domain url', t => {
  const store = new FilteredUrlStore(new MemoryUrlFilter(), new MemoryUrlStore())
  const domainUrl = 'filtereddomain:443'
  const info = { domainUrl, threat: 'virus' }
  return store.put(domainUrl, info).then(() => {
    const u = URL.parse('//filtereddomain:443/page.html', true, true)
    return store.fetch(u).then(r => {
      t.not(r, null)
      t.is(r.info, info)
    })
  })
})
