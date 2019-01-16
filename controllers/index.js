const dbConnection = require('../database/mongoConnection')

const getIndex = async (req, res) => {
    res.send({
        status: true,
        statusCode: 200,
        msg: 'Wellcome main endpoint API Todos Service'
    })
}

const healthCheck = async (req, res) => {
    let status = await dbConnection.checkConnection()
    
    if (status.ok == 1) {
        res.status(200).json({
            status: 'Healty'
        })
    } else {
        res.status(500).json({
            status: 'Unhealty'
        })
    }
}




module.exports = {
    getIndex,
    healthCheck
}