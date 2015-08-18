var page = require('page'); // 7k minified
var serialize = require('form-serialize'); // 2k minified

var get = function (url, token, cb) {
  var http = new XMLHttpRequest();
  http.open('GET', url);
  http.setRequestHeader('Authorization', 'Bearer ' + token);
  http.onreadystatechange = function () {
    if (http.readyState === 4 && http.status === 200) {
      var resp = http.responseText;
      cb(null, JSON.parse(resp));
    }
  };
  http.send();
};

var login = function (data, cb) {
  var http = new XMLHttpRequest();
  http.open('POST', '/login');
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  http.onreadystatechange = function () {
    if (http.readyState === 4 && http.status === 200) {
      var resp = JSON.parse(http.responseText);
      cb(null, resp);
    }
  };
  http.send(data);
};

var hide = function (el) {
  el.classList.add('hidden');
};
var show = function (el) {
  el.classList.remove('hidden');
};

document.addEventListener("WebComponentsReady", function () {
  var app = {};
  // cache elements
  var $f = document.querySelector('form');
  var $ice = document.querySelector('ice-breaker');
  var $list = document.querySelector('ul');
  $list.baseUrl = '/category/';

  // routing
  page('/', function () {
    app.route = 'home';
    [$f, $ice].forEach(show); //ignore for now
  });

  page('/links', function () {
    app.route = 'links';
    [$f, $ice].forEach(hide);
    get('/links', app.token, function (err, res) {
      if (!err && res && res.links) {
        $list.links  = res.links;
      }
      else {
        console.error(err);
      }
    });
  });

  page('/links/:id', function (data) {
    app.route = 'link-info';
    app.params = data.params;
    console.log('in specific link');
  });

  page();

  // observe login form
  $f.addEventListener('submit', function (e) {
    e.preventDefault();
    $f.reason = 'Authorizing...';

    login(serialize($f), function (err, res) {
      if (!err && res.token) {
        $f.reason = 'Authorized';
        app.token = res.token;
        page('/links');
      }
    });
  });

  // observe ice-breaker
  $ice.addEventListener('hack', function () {
    var hacker = 'username=icarus&password=panopticon';
    login(hacker, function (err, res) {
      if (!err) {
        app.token = res.token;
      }
    });
  });
  $ice.addEventListener('hackDone', function () {
    if (app.token) {
      page('/links');
    }
    else {
      // TODO: indicate failure in ice-breaker
    }
  });
});
