var test = require('bandage');
var request = require('co-request');

var app = require('../');
var url = 'http://localhost:8000';

test('setup', function () {
  this.server = app.listen(8000);
});

// ----------------------------------------------------------------------------

test('can reach root unauthenticated', function *(t) {
  var res = yield request(url + '/');
  t.equal(res.statusCode, 200, 'GET / => 200 OK');
});

var rejectionTest = function *(t, type, location, code, loginData) {
  var res = yield request[type]({uri: url + location, json: loginData || {} });
  var body = res.body;
  var creds = ' with body ' + JSON.stringify(loginData || {});
  t.ok(!body.success, 'failed to ' + type.toUpperCase() + ' ' + location + creds);
  t.equal(res.statusCode, code, 'should yield ' + code);
  t.ok(body.reason, 'forbidden', 'forbidden');
};

test('unauthorized beyond auth guard', function *(t) {
  yield rejectionTest(t, 'get', '/links', 401);
});

test('forbidden login without credentials', function *(t) {
  yield rejectionTest(t, 'post', '/login', 403, {});
});

test('forbidden login without correct password', function *(t) {
  var badCreds = { user: 'clux', password: 'a' };
  yield rejectionTest(t, 'post', '/login', 403, badCreds);
});

test('forbidden login with non-existent user', function *(t) {
  var badCreds = { user: 'arstrastasrt', password: 'a' };
  yield rejectionTest(t, 'post', '/login', 403, badCreds);
});

// ----------------------------------------------------------------------------

// auth test exposes bearer token so other tests can reuse it
var auth = {};

test('can authenticate with init_db default creds', function *(t) {
  var creds = { username: 'clux', password: 'heythere' };
  var res = yield request.post({ uri: url + '/login', json: creds });
  var body = res.body;
  t.ok(body.success, 'authenticated');
  t.ok(body.token, 'got token');

  // expose:
  auth.bearer = body.token;
});

// ----------------------------------------------------------------------------

test('can GET /links/ authenticated', function *(t) {
  var res = yield request.get({ url: url + '/links/', auth: auth, json: true });
  t.equal(res.statusCode, 200, 'allowed GET /links/');
  t.ok(Array.isArray(res.body.links), 'links in body');
});

test('can POST /links/ authenticated', function *(t) {
  var data = { title: 'cool place', url: 'http://localhost:8000', category: 'cool' };
  var res = yield request.post({ url: url + '/links/', json: data, auth: auth });
  t.equal(res.statusCode, 200, 'allowed access now');
  t.ok(res.body.success, 'success');
  t.equal(res.body.link.title, 'cool place', 'link validated');
  //t.equal(res.body.link.fk_user, 'clux') // TODO: something like that
});

test('can GET /links/1 authenticated', function *(t) {
  var res = yield request.get({ url: url + '/links/1', auth: auth, json: true });
  t.equal(res.statusCode, 200, 'allowed GET /links/1');
  t.ok(res.body.success, 'success');
  t.equal(res.body.link.title, 'sequelize', 'got first link back (from init_db)');
});

// ----------------------------------------------------------------------------

test('teardown', function (t) {
  this.server.close();
  t.pass('waiting for server to close and database connections to fade away');
});
