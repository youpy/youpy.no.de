var express = require('express');
var http = require('http');
var URL = require('url');
var app = module.exports = express.createServer();
var querystring = require('querystring');
var util = require('util');
var zombie = require('zombie');
var browser = new zombie.Browser({ debug: true });
var request = require('request');
var io = require('socket.io');

browser.runScripts = false;

app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.get('/soundcloud/download.:format', function(req, res){
  var downloadUrl = req.param('download_url');

  if(downloadUrl && downloadUrl.match(/^http:\/\/api\.soundcloud\.com\//)) {
    res.redirect(downloadUrl);
  } else {
    res.send('error', {}, 400);
  }
});

function appendResult(action, result, text) {
  if(action === 'prepend') {
    return result + ' ' + text;
  } else if(action === 'append') {
    return text + ' ' + result;
  } else {
    return result;
  }
}

app.get('/tcs/:name', function(req, res) {
  var servicesURL = 'http://wedata.net/databases/Text%20Conversion%20Services/items.json',
      text = req.param('text') || '';

  request({ uri: servicesURL }, function(error, response, body) {
    var data = JSON.parse(body),
        entry = data.filter(function(e) { return e.name == req.param('name'); })[0],
        responseData = { result: null },
        url,
        doc,
        window;

    if(entry) {
      url = entry.data.url.replace('%s', encodeURIComponent(text));
      if(entry.data.xpath) {
        browser.visit(url, function (err, browser, status) {
          var e = browser.xpath(entry.data.xpath);
          responseData.result = appendResult(entry.data.action, e.stringValue(), text);
          res.send(responseData);
        });
      } else {
        request({ uri: url }, function(error, response, body) {
          responseData.result = appendResult(entry.data.action, body, text);
          res.send(responseData);
        });
      };
    }
  });
});

app.get('/light/', function(req, res) {
  res.render('light.jade');
});

app.get('/ja-tweet/', function(req, res) {
  var url = 'http://ja.favstar.fm/';
  var xpath = '//div[@class="theTweet"]/text()';
  
  browser.visit(url, function (err, browser, status) {
    var e = browser.querySelectorAll('div.theTweet');
    res.send(e[Math.floor(Math.random() * e.length)].textContent);
  });
});

app.get('*', function(req, res){
  res.send('', {'x-x': '\^/ɚ⇂☪øʍę ✞O ᴴ✞ţP://♆OƲþ♆.∩ð.∂∉/'}, 204);
});

if(!module.parent) {
  app.listen(process.env.PORT || 8001);
}

var socket = io.listen(app);
var light = 'off';

socket.on('connection', function(client){
  client.send(light);

  client.on('message', function(message){
    if(message === 'on' || message === 'off') {
      light = message;
      client.broadcast(message);
    }
  });
});
