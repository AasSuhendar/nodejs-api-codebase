const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const bodyParser = require('body-parser')
// const expressValidator = require('express-validator')
const probe = require('kube-probe')
const config = require('./config')

const { createEventAdapter } = require('@slack/events-api')
const slackSigningSecret = config.schema.get('slack.signing_secret')
const slackEvents = createEventAdapter(slackSigningSecret)

const swagger = require('./docs/swagger')
const Response = require('./helpers/response')
const Logger = require('./helpers/logger')

// eslint-disable-next-line no-unused-vars
const kafkaEvent = require('./helpers/event-kafka')
// eslint-disable-next-line no-unused-vars
const observerEvent = require('./event/observer')

const dbMongo = require('./database/mongoConnection')
const dbMysql = require('./database/mysqlConnection')


const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const todosRouter = require('./routes/todos')
const s3Router = require('./routes/s3')
const userRouter = require('./routes/users')
// const elasticRouter = require('./routes/elastic')

const app = express()
app.use(cors())
app.use(helmet())
probe(app)

// Add this to the VERY top of the first file loaded in your app
require('elastic-apm-node').start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'nodejs-api-codebase',
    // Use if APM Server requires a token
    secretToken: '',
    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: config.schema.get('elastic.apm_url')
})

// eslint-disable-next-line no-unused-vars
const producerConfig = {
    clientIdProducer:'KafkaProducer1',
}

// singleton producer init
// kafkaEvent.runKafkaProducer(producerConfig) // uncomment this for activate

// observer consumer init
// observerEvent.init() // uncomment this for activate

// Use the passport package in our application
app.use(passport.initialize())
require('./helpers/auth-basic')

switch (config.schema.get('env')) {
case 'dev':
    app.use(logger('dev'))
    break
case 'test':
    app.use(logger('dev'))
    break
default:
    app.use(logger('combined'))
    break
}

switch (config.schema.get('db.driver')) {
case 'mongo':
    dbMongo.createMongoConnection()
    break
case 'mysql':
    dbMysql.createMysqlConnection()
    break
default:
    Logger.logger('db-status').warn('Not use db connection ?')
    break
}

// Mount the event handler on a route
// NOTE: you must mount to a path that matches the Request URL that was configured earlier
app.use('/slack/events', slackEvents.expressMiddleware())

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event)=> {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`)
})
  
// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error)

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '4mb' }))

// serve swagger
app.get('/users-services-swagger.json', function (_req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(swagger.swaggerSpec)
})

app.get('/favicon.ico', (req, res) => res.status(204))

// logger http access
app.use(function (req, _res, next) {
    if (req.url !== '/favicon.ico') {
        Logger.logger('http-access').info('Access Method ' + req.method + ' at URI ' + req.url)
    }
    next()
})

app.use('/', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/todos', todosRouter)
app.use('/api/s3', s3Router)
app.use('/api/users', userRouter)
// app.use('/api/elastic', elasticRouter)
app.use('/api/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.swaggerSpec))


// catch 404 and forward to error handler
app.use(function (req, res) {
    Logger.logger('http-access').warn('Not Found Method ' + req.method + ' at URI ' + req.url)
    Response.failedResponse(res, 404, 'NOT-FOUND', 'Service not found')
    Logger.logger('http-access').error('Unauthorize access API - Service not found')
})

// error handler
app.use(function (err, req, res) {
    Logger.logger('http-access').error(err)
    Response.failedResponse(res, 500, 'ERROR-SERVICES', 'Server Error')
})

module.exports = app
