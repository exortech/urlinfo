import test from 'ava'
import URL from 'URL'
import MemoryUrlFilter from '../service/memoryUrlFilter'

test('add, verify and remove from filter', t => {
  const url = 'example.com:80/index.html'
  const u = URL.parse('//' + url, true, true)

  const filter = new MemoryUrlFilter()
  return filter.has(u).then(r => t.false(r)).then(() => {
    return filter.add(url)
  }).then(() => {
    return filter.has(u).then(r => t.true(r))
  }).then(() => {
    return filter.remove(url)
  }).then(() => {
    return filter.has(u).then(r => t.false(r))
  })
})
