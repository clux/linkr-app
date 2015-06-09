var kr = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var Link = require('./db').Link;

// TODO: js language for sublime probably outdated..

var list = function *() {
  var links = yield Link.findAll({ limit: 10, offset: 0 });
  this.body = { links: links };
};

var show = function *(id) {
  var link = yield Link.findOne({ where: { id: id } });
  if (!link) { this.throw(404, 'invalid id'); }
  this.body = { link: link };
};

var create = function *() {
  var l = yield parse(this);
  var link = yield Link.create(l);
  this.body = { success: true, data: link };
};

var app = koa();

app.use(kr.get('/:id', show));
app.use(kr.get('/', list));
app.use(kr.post('/', create));

module.exports = app;
