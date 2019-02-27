const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const bodyParser = require('body-parser')
// const expressValidator = require('express-validator')
const probe = require('kube-probe')

const swagger = require('./docs/swagger')
const Response = require('./helpers/response')
const Logger = require('./helpers/logger')
const observerEvent = require('./event/observer')
const config = require('./config')

const dbMongo = require('./database/mongoConnection')
const dbMysql = require('./database/mysqlConnection')
const kafkaEvent = require('./helpers/event-kafka')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const todosRouter = require('./routes/todos')
const s3Router = require('./routes/s3')

const app = express()
app.use(cors())
app.use(helmet())
probe(app)

const producerConfig = {
    clientIdProducer:'todoKafka',
}
const consumerConfig = {
    clientIdConsumer: 'todoKafka',
    groupIdConsumer: 'todoGroupConsumer'
}

kafkaEvent.runKafkaProducer(producerConfig)
kafkaEvent.runKafkaConsumer(consumerConfig)

observerEvent.init()

// Use the passport package in our application
app.use(passport.initialize())
require('./helpers/auth')

switch (config.schema.get('env')) {
    case 'dev':
        app.use(logger('dev'))
        break;
    case 'test':
        app.use(logger('dev'))
        break;
    default:
        app.use(logger('combined'))
        break;
}

switch (config.schema.get('db.driver')) {
    case 'mongo':
        dbMongo.createMongoConnection()
        break;
    case 'mysql':
        dbMysql.createMysqlConnection()
        break;
    default:
        console.log('Not use db connection ?');
        break;
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
