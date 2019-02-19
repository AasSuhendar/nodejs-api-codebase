const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label} = format

var dir = './logs'

const logger = createLogger({
    format: combine(
        label({ label: 'todo-service-log' }),
        timestamp(),
        format.json()
    ),
    defaultMeta: { service: 'todo-service' },
    transports: [
        new transports.File({
            level: 'error',
            filename: dir+'/api-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880,
            maxFiles: 5,
            colorize: true,
            timestamp: true
        }),
        new transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        })
    ],
    exitOnError: false
})

module.exports = logger