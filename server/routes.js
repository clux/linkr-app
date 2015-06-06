var db = require('./db');

var isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

module.exports = function (app, passport) {
  // main
  app.get('/', function (req, res) {
    db.findAll(50, 0, function (err, data) {
      res.render('index.ejs', { user: req.user, links: data });
    });
  });

  // signup / login / logout
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect to signup on error
  }));
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect to signup on error
  }));

  // TODO: get messages in there!
  // currently they are lost because we redirect
  // would have to use connect-flash or AJAX to get them..
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { user: req.user, message: '' });
  });
  app.get('/login', function (req, res) {
    res.render('login.ejs', { user: req.user, message: '' });
  });
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // authenticated areas
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', { user : req.user });
  });
};
