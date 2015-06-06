var User = require('./db').User;

exports.findUserByName = function (username, cb) {
  User.findOne({ where: { username: username }}).then(function (user) {
    cb(null, user ? user.get() : null);
  }).catch(function (err) {
    cb(err);
  });
};

exports.findUserById = function (id, cb) {
  User.findOne({ where: { id: id }}).then(function (user) {
    cb(null, user.get());
  }).catch(function (err) {
    cb(err);
  });
};

var bcrypt = require('bcrypt');
exports.createUser = function (username, email, password, cb) {
  // generate a hash with a length 10 salt prepended and discard the password
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      return cb(err);
    }
    User.create({ username: username, email: email, hash: hash }).then(function (u) {
      cb(null, u.get());
    }).catch(function (err) {
      cb(err);
    });
  });
};

exports.comparePassword = bcrypt.compare; // password, hash, cb
