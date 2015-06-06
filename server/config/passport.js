var LocalStrat = require('passport-local').Strategy;

var User = require('../models/user');

var opts = {
  usernameField: 'username', // by default passport-local uses username
  passwordField: 'password',
  passReqToCallback: true // get req as first arg to cb if true
};

var localLogin = new LocalStrat(opts, function (req, name, pw, cb) {
  User.findUserByName(name, function (err, user) {
    if (err) { return cb(err); }
    if (!user) {
      return cb(null, null, { message: 'No user "' + name + '" found' });
    }
    User.comparePassword(pw, user.hash, function (err, res) {
      if (err) {
        return cb(err);
      }
      if (!res) {
        return cb(null, null, { message: 'Wrong password' });
      }
      cb(null, user);
    });
  });
});

var localSignup = new LocalStrat(opts, function (req, name, pw, cb) {
  User.findUserByName(name, function (err, user) {
    if (err) {
      return cb(err);
    }
    if (user) {
      return cb(null, null, { message: 'User already exists' });
    }
    var email = req.body.email;
    if (!email) {
      return cb(null, null, { message: 'Missing email' });
    }
    // TODO: validate that email does not exist so we avoid unique constraint error?
    // would need to implement Users.findUserByEmail() - but is it actually better?

    User.createUser(name, email, pw, function (err, user) {
      if (err) {
        return cb(err);
      }
      return cb(null, user);
    });
  });
});

module.exports = function (passport) {
  passport.serializeUser(function (user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function (id, cb) {
    User.findUserById(id, function (err, user) {
      cb(err, user);
    });
  });

  passport.use('local-signup', localSignup);
  passport.use('local-login', localLogin);
};
