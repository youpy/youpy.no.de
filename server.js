var express = require('express');
var http = require('http');
var URL = require('url');
var app = module.exports = express.createServer();
var querystring = require('querystring');

function doRequest(url, callback) {
  url = URL.parse(url);
  var client = http.createClient(url.port || 80, url.hostname);
  var request = client.request(url.pathname + (url.search ? url.search : ''), {'host': url.hostname});

  request.end();
  request.on('response', function(response) {
    var body = '';

    response.on('data', function(chunk) {
      body += chunk;
    });

    response.on('end', function() {
      callback(response, body);
    });
  });
}

app.get('/soundcloud/download.:format', function(req, res){
  var downloadUrl = req.param('download_url');

  if(downloadUrl && downloadUrl.match(/^http:\/\/api\.soundcloud\.com\//)) {
    res.redirect(downloadUrl);
  } else {
    res.send('error', {}, 400);
  }
});

app.get('/uniqlooks/looks', function(req, res){
  var params = {
    sort: null,
    gender: null
  };

  for(var i in params) {
    if(params.hasOwnProperty(i)) {
      params[i] = req.params[i];
    }
  }

  var url = 'http://uniqlooks.uniqlo.com/api/looks/search_looks.json?' + querystring.stringify(params);

  doRequest(url, function(response, body) {
    var data = JSON.parse(body).results;

    data.forEach(function(result) {
      result.title = result.user.username;
      if(result.user.occupation !== '')  {
        result.title += '(' + result.user.occupation + ')';
      }
      result.title += ' - ' + result.location;
      result.description = '';
      result.img.forEach(function(imageUrls) {
        result.description += '<p><img src="' + imageUrls.big + '"></p>';
      });
      result.link = 'http://uniqlooks.uniqlo.com/#!/look/' + result.id;
    });

    res.send(data);
  });
});

app.get('*', function(req, res){
  res.send('', {'x-x': '\^/ɚ⇂☪øʍę ✞O ᴴ✞ţP://♆OƲþ♆.∩ð.∂∉/'}, 204);
});

if(!module.parent) {
  app.listen(process.env.PORT || 8001);
}
