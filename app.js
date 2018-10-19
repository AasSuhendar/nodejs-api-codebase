const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')

const env = require('./configs/env')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors())

// Use the passport package in our application
app.use(passport.initialize());
require('./helpers/auth')

mongoose.Promise = require('bluebird')
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(env.database_test, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  mongoose.connection.on('connected', function () { })
} else if (process.env.NODE_ENV === 'dev') {
  mongoose.connect(env.database_dev, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to (dev) :' + env.database_dev)
  })
  app.use(logger('dev'))
} else if (process.env.NODE_ENV === 'prod') {
  mongoose.connect(env.database_prod, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  mongoose.connection.on('connected', function () { })
  app.use(logger('combined'))
  app.use(helmet())
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res
    .status(404)
    .send({
      status: false,
      code: "NOT-FOUND",
      message: "Endpoint notfound"
    });
})

// error handler
app.use(function (err, req, res) {
  res
    .status(500)
    .send({
      status: false,
      code: "ERROR",
      message: "Server error",
      error: err.message
    });
})

module.exports = app;
