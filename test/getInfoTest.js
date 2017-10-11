import test from 'ava'
import getInfo from '../service/getInfo'
import MemoryUrlStore from '../service/memoryUrlStore'

const newEventFor = function (url, queryParams) {
  const event = {
    pathParameters: {
      proxy: url
    }
  }
  if (queryParams) {
    event.queryStringParameters = queryParams
  }
  return event
}

test.cb('accept valid url', t => {
  const url = 'example.com:80/index.html'
  getInfo.handler(newEventFor(url), { store: new MemoryUrlStore() }, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 200)
    t.is(JSON.parse(response.body).message, 'url is valid: ' + url)
    t.end()
  })
})

test.cb('handle missing url', t => {
  getInfo.handler(newEventFor(null), { store: new MemoryUrlStore() }, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 400)
    t.is(JSON.parse(response.body).message, 'url is missing')
    t.end()
  })
})

test.cb('handle malware url', t => {
  const url = 'example.com:80/malware.html'
  const urlStore = new MemoryUrlStore()
  urlStore.put(url, { threat: 'virus' })

  getInfo.handler(newEventFor(url), { store: urlStore }, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 403)
    t.is(JSON.parse(response.body).message, 'url is malware: ' + url)
    t.end()
  })
})

test.cb('handle malware domain', t => {
  const domain = 'malware.com:80'
  const urlStore = new MemoryUrlStore()
  urlStore.put(domain, { threat: 'virus' })

  const url = 'malware.com:80/page.html'
  getInfo.handler(newEventFor(url), { store: urlStore }, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 403)
    t.is(JSON.parse(response.body).message, 'url is malware: ' + domain)
    t.end()
  })
})

test.cb('handle querystring parameters', t => {
  const url = 'malware.com:80/page.html?foo=bar&baz=qux'
  getInfo.handler(newEventFor('malware.com:80/page.html', { foo: 'bar', baz: 'qux' }), { store: new MemoryUrlStore() }, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 200)
    t.is(JSON.parse(response.body).message, 'url is valid: ' + url)
    t.end()
  })
})
