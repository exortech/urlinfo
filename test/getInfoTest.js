import test from 'ava'
import getInfo from '../service/getInfo'
import urlStore from '../service/memoryUrlStore'

const newEventFor = function (url) {
  return {
    pathParameters: {
      proxy: url
    }
  }
}

test.afterEach.always(t => {
  urlStore.clear()
})

test.cb('accept valid url', t => {
  const url = 'example.com:80/index.html'
  getInfo.handler(newEventFor(url), {}, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 200)
    t.is(JSON.parse(response.body).message, 'url is valid: ' + url)
    t.end()
  })
})

test.cb('handle missing url', t => {
  getInfo.handler(newEventFor(null), {}, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 400)
    t.is(JSON.parse(response.body).message, 'url is missing')
    t.end()
  })
})

test.cb('handle malware url', t => {
  const url = 'example.com:80/malware.html'
  urlStore.put(url, { malware: true })

  getInfo.handler(newEventFor(url), {}, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 403)
    t.is(JSON.parse(response.body).message, 'url is malware: ' + url)
    t.end()
  })
})

test.cb('handle malware domain', t => {
  const domain = 'malware.com:80'
  urlStore.put(domain, { malware: true })

  const url = 'malware.com:80/page.html'
  getInfo.handler(newEventFor(url), {}, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 403)
    t.is(JSON.parse(response.body).message, 'url is malware: ' + domain)
    t.end()
  })
})
