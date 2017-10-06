import test from 'ava'
import URL from 'url'
const urlStore = new (require('../service/dynamoDbUrlStore'))({
  region: 'localhost',
  endpoint: 'http://localhost:4567'
})

test('fetch find malware url', t => {
  const url = URL.parse('//malware.com:80/page.html', true, true)
  return urlStore.fetch(url).then(result => {
    t.not(result, null)
    t.is(result.url, 'malware.com:80/page.html')
    t.true(result.shouldBlock())
  })
})

test('fetch find missing url', t => {
  const url = URL.parse('//unknown.com:80/page.html', true, true)
  return urlStore.fetch(url).then(result => {
    t.is(result, null)
  })
})

test('add url to store', t => {
  const url = 'malware.com:80/mw.html'
  return urlStore.put(url, { url, threat: 'virus' }).then(result => {
    t.truthy(result, null)
  })
})
