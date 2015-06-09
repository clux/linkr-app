var tape = require('tape');
var co = require('co');
var cs = require('co-stream');

var tapeRun = function (name, fn) {
  var wrapped = function (t) {
    co(function *() {
      yield fn(t);
      t.end();
    }).catch(function (err) {
      t.error(err, err.message);
    });
  };
  return cs.wait(tape.test(name, wrapped));
};

/*test('co-tape failures', function *(t) {
  var v = yield Promise.resolve(false);
  t.ok(v, 'bad');
  throw new Error('lets throw an error');
  t.ok(l, 'woot');
  t.ok(true, 'heyo');
  t.end();
});*/

// run all tests sequentially
var testAll = function (obj) {
  return Object.keys(obj).map(function *(key) {
    var fn = obj[key];
    yield tapeRun(key, fn);
  });
};


var app = require('../');
var request = require('co-request');
var url = 'http://localhost:8000';


var verifyForbidden = function *(t, type, location, loginData) {
  var res = yield request[type]({url: url + location, json: loginData || {} });
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
  var auth = {username: 'clux', password: 'heythere' };
  var res = yield request.post({url: url + '/login', json: auth });
  var body = res.body;
  t.ok(body.success, 'authenticated');
  t.ok(body.token, 'got token');
  return body.token;
};

var token = null; // reuse after auth

tests.authenticate = function *(t) {
  token = yield authenticate(t);
};

// ----------------------------------------------------------------------------

co(function *() {
  var server = app.listen(8000);
  var res = yield *testAll(tests);
  server.close();
});
