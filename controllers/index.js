const dbMongo = require('../database/mongoConnection')
const dbMysql = require('../database/mysqlConnection')
const config = require('../config')
const auth = require('../helpers/auth-jwt')
const logger = require('../helpers/logger')

const getIndex = async (req, res) => {
    const data = {
        date: new Date(),
        user: 'telkom',
        items: ['one','two']
    }
    // logger.logger('status').info('info', 'user in', data)
    res.send({
        status: true,
        statusCode: 200,
        msg: 'Wellcome main endpoint API Todos Service'
    })
}

const getSecure = async (req, res) => {
    if (!res.get('X-JWT-Claims')) {
        return
    }
    
    let dataClaims = await auth.getClaims(res.get('X-JWT-Claims'))
    res.send({
        status: true,
        statusCode: 200,
        msg: 'Wellcome to secure api ' + dataClaims.data.email
    })
}

const healthCheck = async (req, res) => {
    let status
    if (config.schema.get('db.driver') === 'mongo') {
        status = await dbMongo.checkConnection()
        if (status.ok == 1) {
            res.status(200).json({
                status: 'Healty'
            })
        } else {
            res.status(500).json({
                status: 'Unhealty'
            })
        }
    } else if (config.schema.get('db.driver') === 'mysql') {
        status = await dbMysql.checkConnection()
        
        if (status) {
            res.status(200).json({
                status: 'Healty'
            })
        } else {
            res.status(500).json({
                status: 'Unhealty'
            })
        }
    } else {
        return res.status(200).json({
            status: 'Healty. You not use db'
        })
    }
}

module.exports = {
    getIndex,
    getSecure,
    healthCheck,
}