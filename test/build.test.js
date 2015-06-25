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
});
