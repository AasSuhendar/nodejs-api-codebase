const mongoose = require('mongoose')
const env = require('../configs/env')
const config = require('../config')
const Logger = require('../helpers/logger')

mongoose.Promise = require('bluebird')

const checkConnection = async () => {
    var db = mongoose.connection
    var status = db.db.admin().command({
        ping: 1,
    })
    let returnVal = await status
    return returnVal
}

const cleanUpConnection = async () => {
    mongoose.connection.close(function () {
        Logger.logger('mongoo-server').info(`Mongoose connection close to (${config.schema.get('env')}) is disconnected due to application termination`)
    })
}

const createMongoConnection = () => {

    let dbURI

    if (config.schema.get('db.username') == '' || config.schema.get('db.password') == '' || config.schema.get('db.name') == '') {
        dbURI = 'mongodb://' + config.schema.get('db.host') + ':' + config.schema.get('db.port')
    } else if (config.schema.get('db.username') == '' || config.schema.get('db.password') == '') {
        dbURI = 'mongodb://' + config.schema.get('db.username') + ':' + config.schema.get('db.password') + '@' +
            config.schema.get('db.host') + ':' + config.schema.get('db.port')
    } else {
        dbURI = 'mongodb://' + config.schema.get('db.username') + ':' + config.schema.get('db.password') + '@' +
            config.schema.get('db.host') + ':' + config.schema.get('db.port') + '/' + config.schema.get('db.name')
    }

    mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useCreateIndex: true
    })

    mongoose.connection.on('connected', function () {
        Logger.logger('mongoo-server').info('Server Master Started at PID ' + process.pid)
    })

    mongoose.connection.on('error', function (err) {
        Logger.logger('mongoo-server').error('Mongoose connection has occured ' + err)
        process.exit(1) // exit code 1 = error
    })

    mongoose.connection.on('disconnected', function () {
        Logger.logger('mongoo-server').info(`Mongoose connection to (${config.schema.get('env')}) is disconnected`)
    })
}

module.exports = {
    createMongoConnection,
    checkConnection,
    cleanUpConnection
}