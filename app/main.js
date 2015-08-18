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

document.addEventListener("WebComponentsReady", function () {
  var app = {};

  // routing
  page('/', function () {
    app.route = 'home';
  });

  page('/links', function () {
    app.route = 'links';
    if (!app.token) {
      // this won't actually work yet because GET /links returns json unconditionally
      page('/');
    }
    else {
      console.log('in links');
      get('/links', app.token, function (err, res) {
        console.log(res);
      });
    }
  });

  page('/links/:id', function (data) {
    app.route = 'link-info';
    app.params = data.params;
    console.log('in specific link');
  });

  page();

  // observe login form
  var f = document.querySelector('form');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    f.reason = 'Authorizing...';

    login(serialize(f), function (err, res) {
      f.reason = 'Authorized'; // TODO: deus fade out
      app.token = res.token;
      page('/links');
    });
  });

  // observe ice-breaker
  var ice = document.querySelector('ice-breaker');
  ice.addEventListener('hack', function () {
    var hacker = 'username=icarus&password=panopticon';
    login(hacker, function (err, res) {
      app.token = res.token;
    });
  });
  ice.addEventListener('hackDone', function () {
    if (app.token) {
      page('/links');
    }
  });
});
