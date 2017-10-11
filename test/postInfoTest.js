import test from 'ava'
import postInfo from '../service/postInfo'
import MemoryUrlStore from '../service/memoryUrlStore'

const newEventFor = function (url, body) {
  return {
    pathParameters: {
      proxy: url
    },
    body: JSON.stringify(body)
  }
}

test.cb('store url', t => {
  const url = 'example.com:80/index.html'
  postInfo.handler(newEventFor(url, { threat: 'virus' }), { store: new MemoryUrlStore() }, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 200)
    t.is(JSON.parse(response.body).message, 'info has been stored for: ' + url)
    t.end()
  })
})

test.cb('matching domain should be case insensitive', t => {
  const url = 'example.com:80/malware.html'
  const urlStore = new MemoryUrlStore()

  postInfo.handler(newEventFor('examPle.com:80/malware.html', { threat: 'virus' }), { store: urlStore }, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 200)
    t.truthy(urlStore.store.get(url))
    t.end()
  })
})
