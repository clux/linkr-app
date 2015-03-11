var morgan = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , passport = require('passport')
  , express = require('express')
  ;

require('./config/passport')(passport);

// set up our express application
var app = express();

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

// set up ejs for templating
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));

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
require('./app/routes.js')(app, passport);

app.listen(8000);
