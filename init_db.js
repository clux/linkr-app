#!/usr/bin/env node

// force start up with blank tables and initialize database with test data
var db = require('./server/models/db');
var UserHelper = require('./server/models/user');
var Link = db.Link;
db.inst.sync({ force: true }).then(function() {
  Link.bulkCreate([
    { title: 'sequelize',  url: 'http://docs.sequelizejs.com/', category: 'cool' },
    { title: 'old blog',  url: 'http://clux.org/', category: 'beautiful' },
    { title: 'd3 subreddit', url: 'http://reddit.com/r/diablo', category: 'helpful' }
  ]).catch(function (err) {
    console.error('failed to bulk create links:', err);
    process.exit(1);
  });
  UserHelper.createUser('clux', 'clux@x-pec.com', 'heythere', function (err) {
    if (err) {
      console.error('failed to insert user:', err);
      process.exit(1);
    }
  });
});
