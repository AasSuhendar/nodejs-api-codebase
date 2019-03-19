const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf} = format

const dir = './logs'

const config = require('../config')
const packageJson = require('../package.json')

const schema = printf(({ level, message, label, timestamp, service }) => {
    return `{"timestamp":"${timestamp}","level":"${level}","service":"${service}","label":"${label}",message":"${message}"}`
})

const logger = (tagLabel) => createLogger({
    format: combine(
        label({ label: tagLabel }),
        timestamp(),
        schema
        // format.json()
    ),
    defaultMeta: { service: packageJson.name },
    transports: [
        // new transports.File({
        //     level: 'error',
        //     filename: dir+'/api-logs.log',
        //     handleExceptions: true,
        //     json: true,
        //     maxsize: 5242880,
        //     maxFiles: 5,
        //     colorize: true,
        //     timestamp: true
        // }),
        new transports.Console({
            level: config.schema.get('log.level'),
            handleExceptions: true,
            json: true,
            colorize: true,
            timestamp: true
        })
    ],
    exitOnError: false
})

module.exports = {
    logger
}