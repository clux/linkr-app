#!/usr/bin/env node
var co = require('co');
var bcrypt = require('co-bcrypt');
var db = require('./server/db');
var Link = db.Link;
var User = db.User;
var env = process.env;

if (!env.LINKR_USER || !env.LINKR_EMAIL || !env.LINKR_PASSWORD) {
  throw new Error('Missing LINKR_{} environment variables');
}

var createUser = function *(username, email, password) {
  var hash = yield bcrypt.hash(password, 10);
  return yield User.create({ username, email, hash });
};

// force start up with blank tables and initialize database with a single user
var main = function *() {
  yield db.inst.sync({ force: true });

  var admin = yield createUser(env.LINKR_USER, env.LINKR_EMAIL, env.LINKR_PASSWORD);
  var hacker = yield createUser('icarus', 'h@x.net', 'panopticon');
  console.log('users now contain [%j, %j]', admin, hacker);

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
  process.exit(1);
});
