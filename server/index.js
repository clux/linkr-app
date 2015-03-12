var express = require('express')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , passport = require('passport')
  , helmet = require('helmet')
  , morgan = require('morgan')
  ;

require('./config/passport')(passport);

// set up our express application
var app = express();

// set up ejs for templating
app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));

// security
app.disable('x-powered-by');
// prevent page being put in iframes
app.use(helmet.frameguard('deny'));
// CSP - may need tweaking for CSRF + android use
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'", "'unsafe-inline'", 'localhost'],
  sandbox: ['allow-forms', 'allow-scripts'],
  reportUri: '/report',
  reportOnly: false, // set to true if you only want to report errors
}));
// cross domain policy
app.use(helmet.crossdomain());
// disable cache while developing
app.use(helmet.noCache());

// serve static files
//app.use(express.static(__dirname + '/assets'));

// log every request to the console
app.use(morgan('dev'));

// read cookies for auth
app.use(cookieParser());

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json());

// session middleware
app.use(session({
  secret: 'knickknackpaddywhackgiveacorrecthorseabatterystaple',
  resave: false,
  saveUninitialized: true
}));

// passport using persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

// initialize routes
require('./routes.js')(app, passport);

module.exports = app;
