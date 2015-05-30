var pg = require('pg');
var url = process.env.DATABASE_URL || 'postgres://localhost:5432/linkr';

exports.query = function (query, cb) {
  pg.connect(url, function (err, client, done) {
    if (err) {
      return cb(err);
    }
    client.query(query, function (qerr, result) {
      cb(qerr, result); // pass up result
      done(); // release pg client back to pool
      client.end(); // no more queries
    });
  });
};
