/* File: app.js */
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

/* Libraries */
var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
const passport   = require('passport');
const flash      = require('express-flash');
const session    = require('express-session');

/* Routes */
var authRouter  = require('./routes/authentication');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gamesRouter = require('./routes/game');
var lobbyRouter = require('./routes/lobby');
var testsRouter = require('./routes/tests');

var app = express();

/* Passport */
const initializePassport = require('./passport-config');
initializePassport(passport); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/lobby', lobbyRouter);
app.use('/users', usersRouter);
app.use('/game', gamesRouter);
app.use('/tests', testsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    error: err
  });
});

module.exports = app;
