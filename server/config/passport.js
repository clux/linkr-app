var LocalStrat = require('passport-local').Strategy;

var User = require('../models/user');

var opts = {
  usernameField: 'username', // by default passport-local uses username
  passwordField: 'password',
  passReqToCallback: true // get req as first arg to cb if true
};

var localLogin = new LocalStrat(opts, function (req, name, pw, done) {
  User.findUserByName(name, function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, null, { message: 'No user "' + name + '" found' });
    }
    User.comparePassword(pw, user.hash, function (err, res) {
      if (err) {
        return done(err);
      }
      if (!res) {
        return done(null, null, { message: 'Wrong password' });
      }
      done(null, user);
    });
  });
});

var localSignup = new LocalStrat(opts, function (req, name, pw, done) {
  User.findUserByName(name, function (err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, null, { message: 'User already exists' });
    }
    var email = req.body.email;
    if (!email) {
      return done(null, null, { message: 'Missing email' });
    }
    // TODO: validate that email does not exist so we avoid unique constraint error?
    //Users.findUserByEmail()

    User.createUser(name, email, pw, function (err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  });
});

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findUserById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', localSignup);
  passport.use('local-login', localLogin);
};
