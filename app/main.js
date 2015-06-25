document.addEventListener("DOMContentLoaded", function () {
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
