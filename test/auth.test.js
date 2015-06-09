var tape = require('tape')
var co = require('co');
var test = function (name, fn) {
  var wrapped = function (t) {
    co(function *() {
      yield fn(t);
      t.end();
    }).catch(function (err) {
      t.error(err, err.message);
    });
  };
  tape.test(name, wrapped);
};

/*test('co-tape failures', function *(t) {
  var v = yield Promise.resolve(false);
  t.ok(v, 'bad');
  throw new Error('lets throw an error');
  t.ok(l, 'woot');
  t.ok(true, 'heyo');
  t.end();
});*/


var server = require('../');
var request = require('co-request');
var url = 'http://localhost:8000'


var verifyForbidden = function *(t, type, location, loginData) {
  var res = yield request[type]({url: url + location, json: loginData || {} });
  var body = res.body;
  var creds = ' with body ' + JSON.stringify(loginData || {});
  t.ok(!body.success, 'failed to ' + type.toUpperCase() + ' ' + location + creds);
  t.ok(body.reason, 'forbidden', 'forbidden');
};
test('no access to jwt gated routes', function *(t) {
  yield verifyForbidden(t, 'get', '/links');
});

test('fail to log in without post data', function *(t) {
  yield verifyForbidden(t, 'post', '/login', {});
});

test('fail to log in without correct password', function *(t) {
  var badCreds = { user: 'clux', password: 'a' };
  yield verifyForbidden(t, 'post', '/login', badCreds);
});

test('fail to log in with missing user', function *(t) {
  var badCreds = { user: 'arstrastasrt', password: 'a' };
  yield verifyForbidden(t, 'post', '/login', badCreds);
});

// ----------------------------------------------------------------------------
var authenticate = function *(t) {
  var auth = {username: 'clux', password: 'heythere' };
  var res = yield request.post({url: url + '/login', json: auth });
  var body = res.body;
  t.ok(body.success, 'authenticated');
  t.ok(body.token, 'got token');
  return body.token;
};

test('authenticate', function *(t) {
  var token = yield authenticate(t);
});
