var tape = require('tape');
var co = require('co');
var cs = require('co-stream');

var tapeRun = function (name, fn) {
  var wrapped = function (t) {
    co(function *() {
      yield fn(t);
      t.end();
    }).catch(function (err) {
      // maintain tape error formatting
      t.error(err, err.message);
    });
  };
  // wait for the tape stream to end
  return cs.wait(tape.test(name, wrapped));
};

/*tapeRun('co-tape failures', function *(t) {
  var v = yield Promise.resolve(false);
  t.ok(v, 'bad');
  throw new Error('lets throw an error');
  t.ok(l, 'woot');
  t.ok(true, 'heyo');
  t.end();
});*/

// main test runner - runs all tests sequentially
var testAll = function (obj) {
  return Object.keys(obj).map(function *(key) {
    var fn = obj[key];
    yield tapeRun(key, fn);
  });
};

module.exports = testAll;
