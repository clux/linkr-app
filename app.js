#!/usr/bin/env node

var app = require('./server');

if (true) {
  app.listen(8000);
}
else {
  var fs = require('fs');
  var options = {
    key: fs.readFileSync('/keys/example-key.pem'),
    cert: fs.readFileSync('/keys/example-cert.pem')
  };
  require('http').createServer(app).listen(80);
  require('https').createServer(options, app).listen(443);
}
