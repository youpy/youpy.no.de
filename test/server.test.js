var assert = require('assert');
var app = require('../server');
var util = require('util');

test('/soundcloud/download.mp3 with valid url', function() {
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
});

test('/soundcloud/download.mp3 with invalid url', function() {
  var url = 'http://example.com/';

  assert.response(app, {
    url: '/soundcloud/download.mp3?download_url=' +
      encodeURIComponent(url)
  }, {
    statusCode: 400,
    body: 'error'
  });
});

test('/soundcloud/download.mp3 with no url', function() {
  assert.response(app, {
    url: '/soundcloud/download.mp3'
  }, {
    statusCode: 400,
    body: 'error'
  });
});

test('/uniqlooks/looks', function() {
  assert.response(app, {
    url: '/uniqlooks/looks?sort=hottest'
  }, {
    statusCode: 200
  }, function(res) {
    var data = JSON.parse(res.body);

    assert.ok(data.length > 0);
    assert.ok(data[0].title);
    assert.ok(data[0].description);
    assert.ok(data[0].link);
  });
});

test('tcs(tiisai)', function() {
  var text = encodeURIComponent('テスト');
  var path = encodeURIComponent('ちいさい');

  assert.response(app, {
    url: '/tcs/' + path + '?text=' + text
  }, {
    statusCode: 200
  }, function(res) {
    var data = JSON.parse(res.body);

    assert.equal(' ͭ ͤす ͭ ͦ', data.result);
  });
});

test('tcs(アングラサイト)', function() {
  var text = encodeURIComponent('テスト');
  var path = encodeURIComponent('アングラサイト');

  assert.response(app, {
    url: '/tcs/' + path + '?text=' + text
  }, {
    statusCode: 200
  }, function(res) {
    var data = JSON.parse(res.body);

    assert.equal('テス㌧', data.result);
  });
});

test('tcs(gobi)', function() {
  var text = encodeURIComponent('test');
  var path = encodeURIComponent('append-gobi');

  assert.response(app, {
    url: '/tcs/' + path + '?text=' + text
  }, {
    statusCode: 200
  }, function(res) {
    var data = JSON.parse(res.body);
    var result = data.result;

    assert.match(result, /^test.+/);
  });
});

test('tcs(prefix)', function() {
  var text = encodeURIComponent('test');
  var path = encodeURIComponent('prepend prefix');

  assert.response(app, {
    url: '/tcs/' + path + '?text=' + text
  }, {
    statusCode: 200
  }, function(res) {
    var data = JSON.parse(res.body);
    var result = data.result;

    assert.match(result, /.+test$/);
  });
});

test('tcs(笑い顔顔文字)', function() {
  var text = encodeURIComponent('test');
  var path = encodeURIComponent('笑い顔顔文字');

  assert.response(app, {
    url: '/tcs/' + path + '?text=' + text
  }, {
    statusCode: 200
  }, function(res) {
    var data = JSON.parse(res.body);
    var result = data.result;

    assert.match(result, /^test.+/);
  });
});

['/', '/xxx', '/foo/bar'].forEach(function(path) {
  test(path, function() {
    assert.response(app, {
      url: path
    }, {
      body: '',
      statusCode: 204
    });
  });
});

function test(name, f) {
  module.exports[name] = f;
}
