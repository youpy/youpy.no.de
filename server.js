var express = require('express');
var app = module.exports = express.createServer();

app.get('/soundcloud/download.:format', function(req, res){
  var downloadUrl = req.param('download_url');

  if(downloadUrl && downloadUrl.match(/^http:\/\/api\.soundcloud\.com\//)) {
    res.redirect(downloadUrl);
  } else {
    res.send('error', {}, 400);
  }
});

app.get('*', function(req, res){
  res.send('', {'x-x': '\^/ɚ⇂☪øʍę ✞O ᴴ✞ţP://♆OƲþ♆.∩ð.∂∉/'}, 204);
});

if(!module.parent) {
  app.listen(process.env.PORT || 8001);
}
