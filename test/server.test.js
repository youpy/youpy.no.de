var assert = require('assert');
var app = require('../server');

module.exports = {
  '/soundcloud/download.mp3 with valid url': function() {
    var url = 'http://api.soundcloud.com/tracks/8622419/download?consumer_key=xxxx';

    assert.response(app, {
      url: '/soundcloud/download.mp3?download_url=' +
        encodeURIComponent(url)
    }, {
      statusCode: 302,
      headers: {
        location: url
      }
    });
  },
  '/soundcloud/download.mp3 with invalid url': function() {
    var url = 'http://example.com/';

    assert.response(app, {
      url: '/soundcloud/download.mp3?download_url=' +
        encodeURIComponent(url)
    }, {
      statusCode: 400,
      body: 'error'
    });
  },
  '/soundcloud/download.mp3 with no url': function() {
    assert.response(app, {
      url: '/soundcloud/download.mp3'
    }, {
      statusCode: 400,
      body: 'error'
    });
  }
};

['/', '/xxx', '/foo/bar'].forEach(function(path) {
  module.exports[path] = function() {
    assert.response(app, {
      url: path
    }, {
      body: '',
      statusCode: 204
    });
  };
});
