var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL);

var Link = sequelize.define('Link', {
  title: {
    type: Sequelize.STRING(100),
    validate: { notEmpty: true }
  },
  url: {
    type: Sequelize.STRING(200),
    validate: { isUrl: true, notEmpty: true }
  },
  category: {
    type: Sequelize.STRING(16),
    defaultValue: 0,
    validate: { isAlpha: true }
  },
  // TODO: username link + comments
});

/*var User = sequelize.define('User', {
  //indexes: {
  //  unique: true,
  //  fields: [ 'email' ]
  //},
  email: {
    type: Sequelize.STRING(100),
    validate: { isEmail: true, notEmpty: true }
  },
  username: {
    type: Sequelize.STRING(16),
    validate: { notEmpty: true }
  }
});

Link.belongsTo(User, {foreignKey: 'fk_user'});
*/

sequelize.sync({ force: true }).then(function() {
  Link.bulkCreate([
    { title: 'sequelize',  url: 'http://docs.sequelizejs.com/', category: 'cool' },
    { title: 'clux',  url: 'http://clux.org/', category: 'beautiful' }
  ]);
});

exports.findAll = function (limit, offset, cb) {
  Link.findAll({ limit: limit, offset: offset, raw: true }).then(function (links) {
    cb(null, links);
  }).catch(function (err) {
    cb(err);
  });
};

exports.close = function () {
  sequelize.close();
};

if (module === require.main) {
  setTimeout(function () {
    exports.findAll(5, 0, function (err, links) {
      if (err) {
        console.error(err);
      }
      console.log(links);
    });
  }, 500);
}
