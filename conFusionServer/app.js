var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//  adding our routes
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var favouriteRouter = require('./routes/favouriteRouter');

const mongoose = require('mongoose');

const url = config.mongourl;
const connect = mongoose.connect(url,
  { useNewParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => {
  console.error(err);
});


var app = express();

// to redirect all from http to https
app.all('*', (req, res, next) => {
  if (req.secure) { // if https, this is true
    return next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));

// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

// for passport auth local
app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// // Authentication : not required with tokens
// function auth(req, res, next) {
//   // console.log(req.headers);

//   // without cookie
//   // var authHeader = req.headers.authorization;

//   // if (!authHeader) {
//   //   var err = new Error('You are not authenicated!');

//   //   res.setHeader('WWW-Authenticate', 'Basic');
//   //   err.status = 401;
//   //   next(err);
//   // }

//   // var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString()
//   //   .split(':'); // splits into an array of 2 items

//   // var username = auth[0];
//   // var password = auth[1];

//   // if (username === 'admin' && password === 'password') {
//   //   console.log('Username: ' + username);
//   //   console.log('Password: ' + password);
//   //   next(); // request will pass to next middleware
//   // } else {
//   //   var err = new Error('Wrong credentials!');

//   //   res.setHeader('WWW-Authenicate', 'Basic');
//   //   err.status = 401;
//   //   next(err);
//   // }



//   // with Cookies

//   // console.log(req.signedCookies);

//   // if (!req.signedCookies.user) { // cookie doesnt exist or doesnt contain user
//   //   var authHeader = req.headers.authorization;

//   //   if (!authHeader) {
//   //     var err = new Error('You are not authenicated!');

//   //     res.setHeader('WWW-Authenticate', 'Basic');
//   //     err.status = 401;
//   //     next(err);
//   //     return;
//   //   }

//   //   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString()
//   //     .split(':'); // splits into an array of 2 items

//   //   var username = auth[0];
//   //   var password = auth[1];

//   //   if (username === 'admin' && password === 'password') {
//   //     res.cookie('user', 'admin', { signed: true });
//   //     next();
//   //   } else {
//   //     var err = new Error('Wrong credentials!');

//   //     res.setHeader('WWW-Authenicate', 'Basic');
//   //     err.status = 401;
//   //     next(err);
//   //   }
//   // } else { // cookie is present
//   //   if (req.signedCookies.user === 'admin') {
//   //     next();
//   //   } else {
//   //     var err = new Error('Wrong credentials!');

//   //     res.setHeader('WWW-Authenicate', 'Basic');
//   //     err.status = 401;
//   //     next(err);
//   //   }
//   // }



//   // with session
//   // console.log(req.session);

//   // if (!req.session.user) { // session.user doesnt exist
//   //   var authHeader = req.headers.authorization;

//   //   if (!authHeader) {
//   //     var err = new Error('You are not authenicated!');

//   //     // res.setHeader('WWW-Authenticate', 'Basic');
//   //     err.status = 403;
//   //     next(err);
//   //     return;
//   //   }
//   // } else { // cookie is present
//   //   if (req.session.user === 'authenticated') {
//   //     next();
//   //   } else {
//   //     var err = new Error('You are not authenticated!');
//   //     err.status = 403;
//   //     next(err);
//   //   }
//   // }

//   // with passport

//   if (!req.user) { // auto loaded by passport
//     var err = new Error('You are not authenticated!!!');
//     err.status = 401;
//     return next(err);
//   } else {
//     next();
//   }
// }

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

// our routes
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favourites', favouriteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
