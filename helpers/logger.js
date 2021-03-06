const { createLogger, format, transports } = require('winston')
const { combine, label, printf} = format
const moment = require('moment-timezone')

const dir = './logs'

const config = require('../config')
const packageJson = require('../package.json')

// -------------------------------------------------
// Log Schema Timestamp Constant
const schemaTimestamp = format((info, opts) => {
    if (opts.tz)
        info.timestamp = moment().tz(opts.tz).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ')
    return info
})

// -------------------------------------------------
// Log Schema Format Constant
const schemaFormat = printf(({ level, message, label, timestamp, service }) => {
    return `{"label":"${label}","level":"${level}","msg":"${message}","service":"${service}","time":"${timestamp}}"`
})


const logger = (tagLabel) => createLogger({
    format: combine(
        label({ label: tagLabel }),
        schemaTimestamp({ tz: 'Asia/Jakarta' }),
        schemaFormat
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