var bcrypt = require('co-bcrypt');
var parse = require('co-body');
var render = require('./render');
var jwt = require('koa-jwt');
var fs = require('fs');

var publicKey = fs.readFileSync('./server.rsa.pub');
var privateKey = fs.readFileSync('./server.rsa');

var User = require('./db').User;

exports.postLogin = function *() {
  var claims = yield parse(this, { limit: '1kb' });
  var valid = false;
  var user = null;
  console.log('got claims', JSON.stringify(claims));
  if (claims.username && claims.password) {
    user = yield User.findOne({ where: { username: claims.username } });
  }
  if (user) {
    valid = yield bcrypt.compare(claims.password, user.hash);
  }
  if (valid) {
    var token = jwt.sign(claims, privateKey, { algorithm: 'RS256' });
    this.status = 200;
    this.body = { success: true, token: token };
  }
  else {
    this.status = 403;
    this.body = { success: false, reason: 'forbidden' };
  }
};

// main app entry-point
exports.getLogin = function *() {
  this.body = yield render('main');
};

exports.guard = jwt({ secret: publicKey, algorithm: 'RS256' });
