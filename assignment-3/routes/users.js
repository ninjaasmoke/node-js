var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    })
    .catch((err) => {
      var err = new Error(err);
      err.status = 500;
      return next(err);
    });
});

router.post('/signup', (req, res, next) => {
  // User.findOne({ username: req.body.username })
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    } else {
      // to add fname and lname for user
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful' });
        });
      });
    }
  }); // passport-local-mongoose
});

// without passport
// .then(async (user) => {
//   if (user != null) {
//     var err = new Error('User ' + req.body.username + ' already exists');
//     err.status = 403;
//     next(err);
//   } else {
//     const user_1 = await User.create({
//       username: req.body.username,
//       password: req.body.password
//     });
//   }
// })
// .then((user) => {
//   res.setHeader('Conteent-Type', 'application/json');
//   res.status(200).json({
//     status: 'Registration successful',
//     user: user
//   }, (err) => next(err));
// })
// .catch((err) => next(err));


router.post('/login', passport.authenticate('local'),
  (req, res) => { // added passport.authenticate('local') for passport

    // with passport
    var token = authenticate.getToken({ _id: req.user._id }); // to use passport tokens and jwt
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in' });


    //  add below code befprre 'with passport'
    // if (!req.session.user) { // session.user doesnt exist
    //   var authHeader = req.headers.authorization;

    //   if (!authHeader) {
    //     var err = new Error('You are not authenicated!');

    //     res.setHeader('WWW-Authenticate', 'Basic');
    //     err.status = 401;
    //     next(err);
    //     return;
    //   }

    //   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString()
    //     .split(':'); // splits into an array of 2 items

    //   var username = auth[0];
    //   var password = auth[1];

    //   User.findOne({ username: username })
    //     .then((user) => {
    //       if (user === null) {
    //         var err = new Error('User ' + username + ' not found!');

    //         res.setHeader('WWW-Authenicate', 'Basic');
    //         err.status = 403;
    //         next(err);
    //       } else if (user.password !== password) {
    //         var err = new Error('Wrong password!');

    //         res.setHeader('WWW-Authenicate', 'Basic');
    //         err.status = 403;
    //         next(err);
    //       } else if (user.username === username && user.password === password) {
    //         req.session.user = 'authenticated';
    //         res.statusCode = 200;
    //         res.setHeader('Content-Type', 'text/plain');
    //         res.end('You are authenticated');
    //         next();
    //       } else {
    //         var err = new Error('Someting is wrong!');
    //         err.status = 500;
    //         next(err);
    //       }
    //     })
    //     .catch((err) => next(err));
    // } else {
    //   res.statusCode = 200;
    //   res.setHeader('Content-Type', 'text/plain');
    //   res.end('You are already authenticated!!!');
    // }


  });

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(); // removes the session information
    res.clearCookie('session-id'); // same name given when initializing the cookie
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in! Login first');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
