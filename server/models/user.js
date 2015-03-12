var bcrypt = require('bcrypt-nodejs');

var generateHash = function (pw) {
  return bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
};

exports.correctPassword = function (hash, pw) {
  return bcrypt.compareSync(pw, hash);
};

var users = [
  { id: 1, username: 'bob', hash: generateHash('secret') },
  { id: 2, username: 'joe', hash: generateHash('birthday') }
];

exports.findById = function (id, cb) {
  // hacky lookup (id == idx+1)
  if (users[id-1]) {
    cb(null, users[id-1]);
  }
  else {
    cb(new Error('User ' + id + ' does not exist'));
  }
};

exports.findByUsername = function (name, cb) {
  for (var i = 0, len = users.length; i < len; i += 1) {
    var u = users[i];
    if (u.username === name) {
      return cb(null, u);
    }
  }
  return cb(null, null); // TODO: no error here?
};

exports.save = function (name, pw,  cb) {
  var u = { id: 3, username: name, hash: generateHash(pw) };
  users.push(u);
  cb(null, u);
};
