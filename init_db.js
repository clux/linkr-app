#!/usr/bin/env node
var co = require('co');
var bcrypt = require('co-bcrypt');
var db = require('./server/db');
var Link = db.Link;
var User = db.User;

var createUser = function *(username, email, password) {
  var hash = yield bcrypt.hash(password, 10);
  return yield User.create({ username: username, email: email, hash: hash });
};

// force start up with blank tables and initialize database with a single user
var main = function *() {
  yield db.inst.sync({ force: true });

  var u = yield createUser('clux', 'clux@x-pec.com', 'heythere');
  console.log('users now contain [%j]', u);

  yield Link.bulkCreate([
    { title: 'sequelize',  url: 'http://docs.sequelizejs.com/', category: 'cool' },
    { title: 'old blog',  url: 'http://clux.org/', category: 'beautiful' },
    { title: 'd3 subreddit', url: 'http://reddit.com/r/diablo', category: 'helpful' }
  ]);

  var links = yield Link.findAll();
  console.log('links now contain %j', links);
};

co(main).catch(function (e) {
  console.error(e);
});
