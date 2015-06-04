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

return sequelize.sync({ force: true }).then(function() {
  return Link.create({
    title: 'new link',
    link: 'http://docs.sequelizejs.com/en/latest/docs/models-definition/'
  });
}).then(function (entry) {
  console.log(entry.get({
    plain: true
  }));
});
