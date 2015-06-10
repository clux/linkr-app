var tape = require('./cotape');
var co = require('co'); // for running, should be moved into cotape somehow?
var app = require('../');
var request = require('co-request');
var url = 'http://localhost:8000';

// ----------------------------------------------------------------------------

var verifyForbidden = function *(t, type, location, loginData) {
  var res = yield request[type]({uri: url + location, json: loginData || {} });
  var body = res.body;
  var creds = ' with body ' + JSON.stringify(loginData || {});
  t.ok(!body.success, 'failed to ' + type.toUpperCase() + ' ' + location + creds);
  t.ok(body.reason, 'forbidden', 'forbidden');
};

var tests = {};
tests['can only reach login'] = function *(t) {
  var res = yield request(url + '/');
  t.equal(res.statusCode, 200, 'GET / => 200 OK');
};

tests['forbidden beyond auth guard'] = function *(t) {
  yield verifyForbidden(t, 'get', '/links');
};

tests['forbidden login without_body'] = function *(t) {
  yield verifyForbidden(t, 'post', '/login', {});
};

tests['fail to log in without correct password'] = function *(t) {
  var badCreds = { user: 'clux', password: 'a' };
  yield verifyForbidden(t, 'post', '/login', badCreds);
};

tests['fail to log in with missing user'] = function *(t) {
  var badCreds = { user: 'arstrastasrt', password: 'a' };
  yield verifyForbidden(t, 'post', '/login', badCreds);
};

// ----------------------------------------------------------------------------

var authenticate = function *(t) {
  var auth = { username: 'clux', password: 'heythere' };
  var res = yield request.post({ uri: url + '/login', json: auth });
  var body = res.body;
  t.ok(body.success, 'authenticated');
  t.ok(body.token, 'got token');
  return body.token;
};

var opts = { auth: {} }; // reuse after auth;

tests.authenticate = function *(t) {
  var token = yield authenticate(t);
  opts.auth.bearer = token;
};

// ----------------------------------------------------------------------------

tests.linksGet = function *(t) {
  var res = yield request(url + '/links/', opts);
  t.equal(res.statusCode, 200, 'allowed GET /links/');
  var data = JSON.parse(res.body);
  t.ok(Array.isArray(data.links), 'links in body');
};

//tests.linksPost = function *(t) {
//  var data = { title: 'cool place', url: 'http://localhost:8000', category: 'cool' };
//  var res = yield request({ method: 'POST', url: url + '/links/', json: true, data: data }).auth(null, null, true, opts.auth.token);
//  t.equal(res.statusCode, 200, 'allowed access now');
//  //var data = JSON.parse(res.body);
//  //t.ok(Array.isArray(data.links), 'got links back');
//};


// ----------------------------------------------------------------------------

co(function *() {
  var server = app.listen(8000);
  yield *tape(tests);
  server.close();
});
