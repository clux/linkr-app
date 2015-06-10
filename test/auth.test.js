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

var auth = {}; // reuse after auth;

tests.authenticate = function *(t) {
  var token = yield authenticate(t);
  auth.bearer = token;
};

// ----------------------------------------------------------------------------

tests.linksGet = function *(t) {
  var res = yield request.get({ url: url + '/links/', auth: auth, json: true });
  t.equal(res.statusCode, 200, 'allowed GET /links/');
  t.ok(Array.isArray(res.body.links), 'links in body');
};

tests.linksPost = function *(t) {
  var data = { title: 'cool place', url: 'http://localhost:8000', category: 'cool' };
  var res = yield request.post({ url: url + '/links/', json: data, auth: auth });
  t.equal(res.statusCode, 200, 'allowed access now');
  t.ok(res.body.success, 'success');
  t.equal(res.body.link.title, 'cool place', 'link validated');
  //t.equal(res.body.link.fk_user, 'clux') // TODO: something like that
};

tests.linksGetSingle = function *(t) {
  var res = yield request.get({ url: url + '/links/1', auth: auth, json: true });
  t.equal(res.statusCode, 200, 'allowed GET /links/1');
  t.ok(res.body.success, 'success');
  t.equal(res.body.link.title, 'sequelize', 'got first link back (from init_db)');
};

// ----------------------------------------------------------------------------

co(function *() {
  var server = app.listen(8000);
  yield *tape(tests);
  server.close();
});
