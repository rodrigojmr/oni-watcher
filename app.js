'use strict';

const { join } = require('path');
const express = require('express');
const createError = require('http-errors');
const connectMongo = require('connect-mongo');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const sassMiddleware = require('node-sass-middleware');
const hbs = require('hbs');
const helperDate = require('helper-date');

const serveFavicon = require('serve-favicon');

const bindUserToViewLocals = require('./middleware/bind-user-to-view-locals.js');

const indexRouter = require('./routes/index');
const authenticationRouter = require('./routes/authentication');
const profileRouter = require('./routes/profile');
const animeRouter = require('./routes/anime');
const libraryRouter = require('./routes/library');
const passportRouter = require('./passport-configuration');
const searchRouter = require('./routes/search');
const followRouter = require('./routes/follow');
const postRouter = require('./routes/follow');

const feedRouter = require('./routes/feed');

const passport = require('passport');
require('./passport-configuration.js');

const app = express();

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(join(__dirname, 'views/partials'));
hbs.registerHelper('date', helperDate);
hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1.toString() === arg2.toString()
    ? options.fn(this)
    : options.inverse(this);
});

app.use(serveFavicon(join(__dirname, 'public/images', 'favicon.ico')));
app.use(
  sassMiddleware({
    src: join(__dirname, '/public/styles/sass'),
    dest: join(__dirname, '/public/styles'),
    outputStyle:
      process.env.NODE_ENV === 'development' ? 'nested' : 'compressed',
    force: process.env.NODE_ENV === 'development',
    sourceMap: true
  })
);
app.use(express.static(join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 15,
      sameSite: 'none',
      secure: true
    },
    store: new (connectMongo(expressSession))({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bindUserToViewLocals);

app.use('/authentication', authenticationRouter);
app.use('/profile', profileRouter);
app.use('/search', searchRouter);
app.use('/anime', animeRouter);
app.use('/', libraryRouter);
app.use('/', passportRouter);
app.use('/', followRouter);
app.use('/', feedRouter);
app.use('/', postRouter);
app.use('/', indexRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
