import test from 'ava'
import URL from 'url'
const urlFilter = new (require('../service/redisUrlFilter'))()

test('add to filter and verify', t => {
  const url = 'malware-redis:80/thest.html'
  return urlFilter.add(url).then(res => {
    t.not(res, null)
    return urlFilter.has(URL.parse('//' + url, true, true)).then(res => {
      t.is(res, true)
    })
  })
})

test('add domain url to filter and verify', t => {
  return urlFilter.add('malware-redis2:80').then(res => {
    t.not(res, null)
    return urlFilter.has(URL.parse('//malware-redis2:80/page.html', true, true)).then(res => {
      t.is(res, true)
    })
  })
})
