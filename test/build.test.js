var test = require('bandage');
var fs = require('co-fs');

test('web components', function *(t) {
  var html = yield fs.readFile('./assets/html/components.html', 'utf8');
  var pmr = 'Polymer = {'; // a string that's unique in polymer.html
  t.ok(html.indexOf(pmr) > 0, 'polymer object found');
  t.equal(html.indexOf(pmr), html.lastIndexOf(pmr), 'polymer not found twice');

  t.ok(html.indexOf('ice-breaker') >= 0, 'ice-breaker found');
  t.ok(html.indexOf('linkr-list') >= 0, 'linkr-list found');

  t.ok(html.indexOf('src="http') < 0, 'no external src links');
  t.ok(html.indexOf('src=".') < 0, 'no relative src links');
  t.ok(html.indexOf('src="/') < 0, 'no internal src links');
  t.ok(html.indexOf('data:image/png;base64') >= 0, 'images inlined');
  // could maybe enforce a max size of inlined images here

  // current size of components + polymer bundle (the biggest file)
  // keep track of it incase it increases significantly
  t.ok(html.length > 150000, 'html bundle contains at least what we expect');
  t.ok(html.length < 170000, 'html bundle has not gotten too large recently');
  // TODO: minify this bundle somehow
});

// document dependencies that are pulled in somewhat and what to expect
test('client app contents', function *(t) {
  var js = yield fs.readFile('./assets/js/main.js', 'utf8');
  t.ok(js.length, 'client side app exists');

  // page
  var page = 'function page(path, fn)';
  t.ok(js.indexOf(page) > 0, 'page function exported');
  t.equal(js.lastIndexOf(page), js.indexOf(page), 'page not found twice');
  // TODO: this does not need to pull in process shim, but currently it does
  // because of NW.js compat for windows - can patch it probably
  //var prcsShim = 'process.env';
  //t.equal(js.indexOf(prcsShim), -1, 'no process shim');

  /* try to live without superagent which is 10k minified
  // superagent + emitters
  var ajax = 'function Request(method, url)';
  t.ok(js.indexOf(ajax) > 0, 'superagent exported');
  t.equal(js.lastIndexOf(ajax), js.indexOf(ajax), 'superagent not found twice');
  // This pulls in component-emitter and reduce-component (tiny)
  var weirdEmitter = "require('emitter')";
  t.ok(js.indexOf(weirdEmitter) > 0, 'component-emitter present');
  // dont want two event emitters at least though..
  var normalEmitter = 'EventEmitter';
  t.equal(js.indexOf(normalEmitter), -1, 'no node emitter pulled in');
  */

  // form serialize
  var srlz = 'function serialize(form, options)';
  t.ok(js.indexOf(srlz) > 0, 'form serialize library included');
  t.equal(js.lastIndexOf(srlz), js.indexOf(srlz), 'serialize not found twice');
  // TODO: can probably ditch this in future if co-body starts support mdn FormData
  // currently it fails to parse the multipart/formdata type and thus we fail
});

test('client app size', function *(t) {
  var js = yield fs.readFile('./assets/js/main.min.js');
  t.ok(js.length, 'client side app exists minified');

  // force significant client app sizes increases to notified us via CI
  // change limit when appropriate - current bounds: [ 5k, 10k ]
  t.ok(js.length > 5000, 'app contains at least what we expect');
  t.ok(js.length < 10000, 'app has not gotten too large recently');
});
