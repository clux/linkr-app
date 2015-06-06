var express = require('express')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , passport = require('passport')
  , helmet = require('helmet')
  , morgan = require('morgan')
  , join = require('path').join
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

// prevent clickjacking
app.use(helmet.frameguard('deny'));

// disable mime type inferral of scripts (specify the language in script tag!)
app.use(helmet.nosniff());

/**
 * CSP
 *
 * currently disabled since it's a bit of a pain
 * Know we will need:
 *  -scriptSrc: ["'self'", "'unsafe-inline'"] for inline src init of linkr-list
 *  -styleSrc: ["'self'", "'unsafe-inline'"] for inline styles if we want this..
 * something else to allow doing the link rel import of the vulcanized set..
 * see https://github.com/helmetjs/helmet
 */
//app.use(helmet.contentSecurityPolicy({
//  sandbox: ['allow-forms', 'allow-scripts'],
//  reportUri: '/report', // TODO: tune when adding CSURF
//  reportOnly: false, // set to true if you only want to report errors
//}));

// disable cache while developing
app.use(helmet.noCache());

// serve static files
app.use(express.static(join(__dirname, '..', 'assets')));

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
