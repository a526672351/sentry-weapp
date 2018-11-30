'use strict';
import Raven from 'raven-js'

Raven.setTransport(options => {
  wx.request({
    url: options.url + '?' + urlencode(options.auth),
    method: 'POST',
    header: {
      'content-type': 'text/plain;charset=UTF-8'
    },
    data: options.data,
    success: function() {
      options.onSuccess && options.onSuccess();
    },
    fail: function(err) {
      options.onError && options.onError(err);
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
