import test from 'ava'
import URL from 'url'
const urlStore = new (require('../service/dynamoDbUrlStore'))({
  region: 'localhost',
  endpoint: 'http://localhost:4567'
})

test('fetch finds malware url', t => {
  const url = URL.parse('//malware.com:80/page.html', true, true)
  return urlStore.fetch(url).then(result => {
    t.not(result, null)
    t.is(result.url, 'malware.com:80/page.html')
    t.true(result.shouldBlock())
  })
})

test('fetch finds missing url', t => {
  const url = URL.parse('//unknown.com:80/page.html', true, true)
  return urlStore.fetch(url).then(result => {
    t.is(result, null)
  })
})

test('fetch finds domain url when matching page', t => {
  const domainUrl = 'malware2.com:80'
  return urlStore.put(domainUrl, { domainUrl, threat: 'virus' }).then(result => {
    const url = URL.parse('//malware2.com:80/page.html', true, true)
    return urlStore.fetch(url).then(result => {
      t.not(result, null)
      t.is(result.url, 'malware2.com:80')
      t.true(result.shouldBlock())
    })
  })
})

test('add url to store', t => {
  const url = 'malware.com:80/mw.html'
  return urlStore.put(url, { url, threat: 'virus' }).then(result => {
    t.truthy(result, null)
    return urlStore.fetch(URL.parse('//' + url, true, true)).then(result => {
      t.not(result, null)
      t.is(result.url, url)
    })
  })
})

test('add domain url to store', t => {
  const url = 'malware-d.com:80'
  return urlStore.put(url, { url, threat: 'virus' }).then(result => {
    t.truthy(result, null)
    return urlStore.fetch(URL.parse('//' + url, true, true)).then(result => {
      t.not(result, null)
      t.is(result.url, url)
    })
  })
})
