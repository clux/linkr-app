var express = require('express')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , passport = require('passport')
  , morgan = require('morgan')
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

if (true) {
  app.listen(8000);
}
else {
  var fs = require('fs');
  var options = {
    key: fs.readFileSync('/keys/example-key.pem'),
    cert: fs.readFileSync('/keys/example-cert.pem')
  };
  require('http').createServer(app).listen(80);
  require('https').createServer(options, app).listen(443);
}
