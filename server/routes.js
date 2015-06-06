var LinksHelper = require('./models/links');

var isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

module.exports = function (app, passport) {
  // main
  app.get('/', function (req, res) {
    LinksHelper.findPage(50, 0, function (err, data) {
      res.render('index.ejs', { user: req.user, links: data });
    });
  });

  // signup / login
  app.post('/signup', function (req, res, next) {
    passport.authenticate('local-signup', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        if (!process.env.LINKR_COV) {
          console.log(info.message); // TODO: pass on info with ajax instead
        }
        return res.redirect('/signup');
      }
      req.logIn(user, function (err) {
        if (err) { return next(err); }
        return res.redirect('/profile');
      });
    })(req, res, next);
  });
  app.post('/login', function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        if (!process.env.LINKR_COV) {
          console.log(info.message); // TODO: pass on info with ajax instead
        }
        return res.redirect('/login');
      }
      req.logIn(user, function (err) {
        if (err) { return next(err); }
        return res.redirect('/profile');
      });
    })(req, res, next);
  });


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
