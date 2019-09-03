const config = require('../config')
const DSNParser = require('dsn-parser')
const Sequelize = require('sequelize')
const Logger = require('../helpers/logger')

const connType = () => {
    let dbURI = 'mysql://' + config.schema.get('db.username') + ':' + config.schema.get('db.password') + '@' +
        config.schema.get('db.host') + ':' + config.schema.get('db.port') + '/' + config.schema.get('db.name')
    return new DSNParser(dbURI).getParts()
}

const sequelizePoolConnection = new Sequelize(connType().database, connType().user, connType().password, {
    operatorsAliases: false,
    host: connType().host,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: console.log // value = false, or console.log
})

const checkConnection = async () => {
    let status = await sequelizePoolConnection
        .authenticate()
        .then(() => {
            Logger.logger('mysql-server').info('Connection has been established successfully.')
            return true
        }, (err) => {
            Logger.logger('mysql-server').error('Unable to connect to the database:', err)
            return false
        })
    return status
}

const createMysqlConnection = () => {
    sequelizePoolConnection
        .authenticate()
        .then(function () {
            Logger.logger('mysql-server').info('Connection has been established successfully.')
        }, function (err) {
            Logger.logger('mysql-server').error('Unable to connect to the database:', err)
        })

    sequelizePoolConnection.sync({
        // force: true
    })
        .then(() => {
            Logger.logger('mysql-server').info('Database & tables created!')
        })

    return sequelizePoolConnection
}

module.exports = {
    sequelizePoolConnection,
    createMysqlConnection,
    checkConnection
}