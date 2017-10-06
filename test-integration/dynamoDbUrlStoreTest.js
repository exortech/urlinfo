import test from 'ava'
import URL from 'url'
import urlStore from '../service/dynamoDbUrlStore'

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
