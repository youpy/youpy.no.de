var express = require('express');
var app = express.createServer();

app.get('/', function(req, res){
  res.send('', {}, 204);
});

app.get('/soundcloud/download.:format', function(req, res){
  var downloadUrl = req.param('download_url');

  if(downloadUrl && downloadUrl.match(/^http:\/\/api\.soundcloud\.com\//)) {
    res.redirect(downloadUrl);
  } else {
    res.send('error', {}, 400);
  }
});

app.listen(process.env.PORT || 8001);
