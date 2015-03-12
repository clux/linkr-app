var LocalStrat = require('passport-local').Strategy;
var User = require('../models/user');

var opts = {
  usernameField: 'username', // by default passport-local uses username
  passwordField: 'password',
  passReqToCallback: true // get req as first arg to cb if true
};

var localLogin = new LocalStrat(opts, function (req, name, pw, done) {
  process.nextTick(function () {
    User.findByUsername(name, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'No user "' + name + '" found' });
      }
      if (!User.correctPassword(user.hash, pw)) {
        return done(null, false, { message: 'Wrong password' });
      }
      return done(null, user);
    });
  });
});

var localSignup = new LocalStrat(opts, function (req, name, pw, done) {
  process.nextTick(function () {
    User.findByUsername(name, function (err, user) {
      if (err) { return done(err); }
      if (user) {
        return done(null, false, { message: 'User already exists' });
      }
      User.save(name, pw, function (err, user) {
        if (err) { throw err; }
        return done(null, user);
      });
    });
  });
});

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', localSignup); 
  passport.use('local-login', localLogin); 
};
