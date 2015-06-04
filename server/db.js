var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL);

var Link = sequelize.define('Link', {
  title: {
    type: Sequelize.STRING(100),
    validate: { notEmpty: true }
  },
  link: {
    type: Sequelize.STRING(200),
    validate: { isUrl: true, notEmpty: true }
  },
  category: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: { min: 0, max: 10 }
  },
  // TODO: username link + comments
});

sequelize.sync({ force: true }).then(function() {
  Link.bulkCreate([
    { title: 'sequelize',  link: 'http://docs.sequelizejs.com/' },
    { title: 'clux',  link: 'http://clux.org/' }
  ]).then(function () {
    Link.findAll({ limit: 5, offset: 0, raw: true }).then(function (links) {
      console.log(links);
    });
  });
});
