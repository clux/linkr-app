var kr = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var Link = require('./db').Link;

var list = function* listLinks() {
  var links = yield Link.findAll({ limit: 10, offset: 0 });
  this.body = { links };
};

var show = function* showLink(id) {
  var link = yield Link.findOne({ where: { id: id } });
  if (!link) { this.throw(404, 'invalid id'); }
  this.body = { success: true, link: link };
};

var create = function* createLink() {
  var l = yield parse(this);
  //console.log('link', l, 'from user', this.state.user.username)
  // TODO: sequelize to set link.fk_user to id of this.state.username
  var link = yield Link.create(l);
  this.body = { success: true, link: link };
};

var app = koa();

app.use(kr.get('/:id', show));
app.use(kr.get('/', list));
app.use(kr.post('/', create));

module.exports = app;
