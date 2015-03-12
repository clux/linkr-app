var request = require('request');
var http = require('http');
var app = require('../');

module.exports = {
  setUp: function (cb) {
    this.server = http.createServer(app);
    this.server.listen(8000);
    cb();
  },
  tearDown: function (cb) {
    this.server.close();
    cb();
  },

  getRoot: function (t) {
    request('http://localhost:8000/', function (err, resp, body) {
      t.equal(err, null, 'no error');
      t.equal(resp.statusCode, 200, '200 OK');
      t.ok(body.length > 100, "some data returned");
      t.equal(body.slice(0, 15), "<!DOCTYPE html>", 'returned HTML');
      t.done();
    });
  }
};
