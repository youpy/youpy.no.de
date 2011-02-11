var express = require('express');
var app = express.createServer();

app.get('/', function(req, res){
  res.send('H');
});

app.get('/soundcloud/download.wav', function(req, res){
  var downloadUrl = req.param('download_url');

  if(downloadUrl) {
    res.redirect(downloadUrl);
  } else {
    res.send('error', {}, 400);
  }
});

app.listen(process.env.PORT || 8001);
