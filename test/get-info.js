import test from 'ava'
import getInfo from '../service/get-info'
import urlStore from '../service/memoryUrlStore'

const newEventFor = function (url) {
  return {
    pathParameters: {
      proxy: url
    }
  }
}

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

test.cb('handle invalid url', t => {
  const url = 'example.com:80/malware.html'
  urlStore.put(url, { malware: true })
  getInfo.handler(newEventFor(url), {}, (err, response) => {
    t.is(err, null)
    t.is(response.statusCode, 403)
    t.is(JSON.parse(response.body).message, 'url is malware: ' + url)
    t.end()
  })
})
