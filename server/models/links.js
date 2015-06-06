var Link = require('./db').Link;

exports.findPage = function (limit, offset, cb) {
  Link.findAll({ limit: limit, offset: offset, raw: true }).then(function (links) {
    cb(null, links);
  }).catch(function (err) {
    cb(err);
  });
};
