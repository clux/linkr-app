var linkr = require(process.env.LINKR_COV ? '../server-cov/' : '../server/');
var request = require('request');
var http = require('http');

var root = 'http://localhost:8000';

module.exports = {
  setUp: function (cb) {
    this.server = http.createServer(linkr);
    this.server.listen(8000);
    cb();
  },
  tearDown: function (cb) {
    this.server.close();
    cb(); // NB: takes 5s or so for pool to drop
  },

  getRoot: function (t) {
    request(root, function (err, resp, body) {
      t.equal(err, null, 'no error');
      t.equal(resp.statusCode, 200, '200 OK');
      t.ok(body.length > 100, "some data returned");
      t.equal(body.slice(0, 15), "<!DOCTYPE html>", 'returned HTML');
      t.done();
    });
  },

  loginWrongUser: function (t) {
    var url = root + '/login';
    request.post(url, { form: { username: 'whoisthisguy', password: 'bah'} },
      function (err, resp, body) {
        t.equal(err, null, 'no error');
        t.equal(resp.statusCode, 302, '302 redirect');
        t.ok(resp.headers.location, 'location header set on redirect');
        t.equal(resp.headers.location, '/login', 'failed to log in');
        t.done();
    });
  },

  loginWrongPassword: function (t) {
    var url = root + '/login';
    request.post(url, { form: { username: 'clux', password: 'notright'} },
      function (err, resp, body) {
        t.equal(err, null, 'no error');
        t.equal(resp.statusCode, 302, '302 redirect');
        t.ok(resp.headers.location, 'location header set on redirect');
        t.equal(resp.headers.location, '/login', 'failed to log in');
        t.done();
    });
  },

  loginValid: function (t) {
    var url = root + '/login';
    request.post(url, { form: { username: 'clux', password: 'heythere'} },
      function (err, resp, body) {
        t.equal(err, null, 'no error');
        t.equal(resp.statusCode, 302, '302 redirect');
        t.ok(resp.headers.location, 'location header set on redirect');
        t.equal(resp.headers.location, '/profile', 'managed to log in');
        t.done();
    });
  },
};
