var pg = require('pg');
var url = process.env.DATABASE_URL;

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

if (module === require.main) {
  exports.query('SELECT NOW() AS "theTime"', function (err, res) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(res.rows[0].theTime);
  });
}
