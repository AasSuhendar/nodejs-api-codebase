const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
// const expressValidator = require('express-validator')
const probe = require('kube-probe')

const swagger = require('./docs/swagger')
const Response = require('./helpers/response')
const Logger = require('./helpers/logger')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const todosRouter = require('./routes/todos')
const s3Router = require('./routes/s3')

const app = express()
app.use(cors())
probe(app)

// Use the passport package in our application
app.use(passport.initialize())
require('./helpers/auth')

if (process.env.NODE_ENV === 'dev') {
    app.use(logger('dev'))
} else {
    app.use(logger('combined'))
    app.use(helmet())
}

if (process.env.DB_TYPE === 'mysql') {
    const dbConnection = require('./database/mysqlConnection').sequelizeCreateConnection
    require('./database/mysqlConnection').initialDB(dbConnection)
} else {
    const dbConnection = require('./database/mongoConnection')
    dbConnection.createMongoConnection()
}

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '4mb' }))

// serve swagger
app.get('/users-services-swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(swagger.swaggerSpec)
})

app.use('/', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/todos', todosRouter)
app.use('/api/s3', s3Router)
app.use('/api/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.swaggerSpec))

// catch 404 and forward to error handler
app.use(function (req, res) {
    Response.failedResponse(res, 404, 'NOT-FOUND', 'Service not found')
    Logger.error('Unauthorize access API - Service not found')
})

// error handler
app.use(function (req, res) {
    Response.failedResponse(res, 500, 'ERROR-SERVICES', 'Server Error')
})


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    Response.failedResponse(res, status, 'ERROR-SERVICES', 'Error Occured', { message: message, data: data })
    // res.status(status).json({ message: message, data: data })
})
module.exports = app
