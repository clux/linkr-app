var koa = require('koa');
var route = require('koa-route');
var logger = require('koa-logger');
var mount = require('koa-mount');
var serve = require('koa-static');
var postApp = require('./routes');
var auth = require('./auth');

var app = koa();
app.use(logger());


// NB: this serves favicon.ico as well - not sure if that's problematic
app.use(serve('./assets')); // TODO: compress these

// error handling - first needed for stuff below here probably
app.use(function *(next) {
  try { yield next; }
  catch(e) {
    //console.log(e.message);
    if (e.status === 401 ) { // auth guard
      this.status = e.status;
      this.body = { success: false, reason: 'Forbidden' };
    }
    else {
      console.log(e.message);
      throw e; // unhandled for now - pass it on
    }
  }
});

// app entrypoint
app.use(route.get('/', auth.getLogin));
app.use(route.post('/login', auth.postLogin));
app.use(auth.guard);

// secure sub-app
app.use(mount('/links', postApp));

module.exports = app;
