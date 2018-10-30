const express = require('express')
const cookieParser = require('cookie-parser');
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const expressValidator = require('express-validator')
const probe = require('kube-probe')

const dbConnection = require('./database/mongoConnection')
const swagger = require('./docs/swagger')
const Response = require('./helpers/response')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const todosRouter = require('./routes/todos')

const app = express();
app.use(cors())
app.use(expressValidator())
probe(app);

// Use the passport package in our application
app.use(passport.initialize());
require('./helpers/auth')

if (process.env.NODE_ENV === 'dev') {
  app.use(logger('dev'))
} else {
  app.use(logger('combined'))
  app.use(helmet())
}

dbConnection.createMongoConnection()

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
app.use('/api/todos', todosRouter);
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
