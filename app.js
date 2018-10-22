const express = require('express')
const cookieParser = require('cookie-parser');
const logger = require('morgan')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const expressValidator = require('express-validator')
const probe = require('kube-probe')

const env = require('./configs/env')
const swagger = require('./docs/swagger')
const Response = require('./helpers/response')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express();
app.use(cors())
app.use(expressValidator())
probe(app);

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


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// serve swagger
app.get('/users-services-swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swagger.swaggerSpec);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.swaggerSpec));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  Response.failedResponse404(req, res, 'NOT-FOUND', 'Service not found')
})

// error handler
app.use(function (err, req, res) {
  Response.failedResponse500(req, res, 'ERROR-SERVICES', 'Server Error', err.message)
})

module.exports = app;
