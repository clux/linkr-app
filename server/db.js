if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.LINKR_SILENT ? false : console.log
});

var User = sequelize.define('User', {
  email: {
    type: Sequelize.STRING(100),
    unique: true,
    validate: { isEmail: true, notEmpty: true }
  },
  username: {
    type: Sequelize.STRING(16),
    unique: true,
    validate: { notEmpty: true }
  },
  hash: {
    type: Sequelize.STRING(60), // length returned by bcrypt
    validate: { notEmpty: true }
  }
});

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
    validate: { is: ['^[a-z]+$','i'] }
  }
});

Link.belongsTo(User, { foreignKey: 'fk_user' }); // TODO: validate on Link?

// this is an entry point for models
exports.Link = Link;
exports.User = User;

// entry point for database initialization
exports.inst = sequelize;
