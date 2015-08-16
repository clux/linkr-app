var page = require('page');
document.addEventListener("DOMContentLoaded", function () {
  var app = {};

  // routing
  window.addEventListener('WebComponentsReady', function() {
    page('/', function () {
      app.route = 'home';
    });

    page('/links', function () {
      app.route = 'links';
    });

    page('/links/:id', function (data) {
      app.route = 'link-info';
      app.params = data.params;
    });

    page();
  });

  var f = document.querySelector('form');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(f);
    f.reason = 'Authorizing...'; // TODO: status rename
    // TODO: content-type messy, just use superagent?
    var request = new XMLHttpRequest();
    request.open("POST", "/login");
    request.send(fd);
  });
});
