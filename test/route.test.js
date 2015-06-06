var linkr = require(process.env.LINKR_COV ? '../server-cov/' : '../server/');
var request = require('request');
var http = require('http');

var root = 'http://localhost:8000';

var verifyRedirect = function (t, resp) {
  t.equal(resp.statusCode, 302, '302 redirect');
  t.ok(resp.headers.location, 'location header set on redirect');
  return resp.headers.location;
};

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
      function (err, resp) {
        t.equal(err, null, 'no error');
        t.equal(verifyRedirect(t, resp), '/login', 'failed to log in');
        t.done();
    });
  },

  loginWrongPassword: function (t) {
    var url = root + '/login';
    request.post(url, { form: { username: 'clux', password: 'notright'} },
      function (err, resp) {
        t.equal(err, null, 'no error');
        t.equal(verifyRedirect(t, resp), '/login', 'failed to log in');
        t.done();
    });
  },

  loginValid: function (t) {
    var url = root + '/login';
    request.post(url, { form: { username: 'clux', password: 'heythere'} },
      function (err, resp) {
        t.equal(err, null, 'no error');
        t.equal(verifyRedirect(t, resp), '/profile', 'managed to log in');
        t.done();
    });
  },

  signupNameTaken: function (t) {
    var url = root + '/signup';
    request.post(url,
      { form: { username: 'clux', email: 'me@hax.net', password: 'heythere'} },
      function (err, resp) {
        t.equal(err, null, 'no error');
        t.equal(verifyRedirect(t, resp), '/signup', 'failed to recreate user');
        t.done();
    });
  },

  signupNoPassword: function (t) {
    var url = root + '/signup';
    request.post(url, { form:
      { username: 'newuser', email: 'me@hax.net', password: ''} },
      function (err, resp) {
        t.equal(err, null, 'no error');
        t.equal(verifyRedirect(t, resp), '/signup', 'failed to recreate user');
        t.done();
    });
  },

  signupSuccess: function (t) {
    var url = root + '/signup';
    request.post(url,
      { form: { username: 'newuser', email: 'me@hax.net', password: 'wootinator'} },
      function (err, resp) {
        t.equal(err, null, 'no error');
        t.equal(verifyRedirect(t, resp), '/profile', 'managed to sign up');
        t.done();
    });
  },

  signupNoEmail: function (t) {
    var url = root + '/signup';
    request.post(url,
      { form: { username: 'newuser2', password: 'wootinator'} },
      function (err, resp) {
        t.equal(err, null, 'no error');
        t.equal(verifyRedirect(t, resp), '/signup', 'failed to sign up');
        t.done();
    });
  },
};
