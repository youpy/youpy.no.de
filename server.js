var express = require('express');
var http = require('http');
var URL = require('url');
var app = express.createServer();

function doRequest(url, callback) {
  var client = http.createClient(url.port || 80, url.hostname);
  var request = client.request(url.pathname + url.search, {'host': url.hostname});
  request.end();
  request.on('response', function(response) {
    callback(response);
  });
};

app.get('/', function(req, res){
  res.send('H');
});

app.get('/soundcloud/download.:format', function(req, res){
  var downloadUrl = req.param('download_url');

  if(downloadUrl) {
    res.redirect(downloadUrl);
  } else {
    res.send('error', {}, 400);
  }
});

app.get('/soundcloud/detect_format', function(req, res){
  var downloadUrl = req.param('download_url'),
      url,
      client,
      request,
      filename;
  
  if(downloadUrl) {
    url = URL.parse(downloadUrl);
    doRequest(url, function(response) {
      url = URL.parse(response.headers['location']);
      doRequest(url, function(response) {
        var format = response.headers['content-disposition'].match(/\.([^\.]+)"$/)[1];
        res.send(format || 'xxx');
      });
    });
  } else {
    res.send('error', {}, 400);
  }
});

app.listen(process.env.PORT || 8001);
