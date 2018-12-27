const Response = require('../helpers/response')
const JWT = require('../helpers/jwt')
const utils = require('../helpers/utils')

const validateToken = async (req, res) => {
    try {
        let token = utils.getToken(req.headers)
        if (token) {
            let decoded = await JWT.verifyToken(token)
            Response.successResponse(req, res, 200, 'USERS-SERVICE', 'Token Valid', decoded)
        }
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    validateToken
}