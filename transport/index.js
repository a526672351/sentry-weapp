'use strict';
import Raven from 'raven-js'

Raven.setTransport(options => {
  options.method = 'POST'
  options.url = options.url + '?' + urlencode(options.auth)
  wx.request(options).then(response => {
    if (response.ok) {
      options.onSuccess && options.onSuccess()
    } else {
      var error = new Error('Sentry error code: ' + response.status)
      // It's called request only to keep compatibility with XHR interface
      // and not add more redundant checks in setBackoffState method
      error.request = response
      options.onError && options.onError(error)
    }
  })
})

function urlencode (o) {
  var pairs = []
  for (var key in o) {
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(o[key]))
  }
  return pairs.join('&')
}

export default Raven;
