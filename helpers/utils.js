var User = require('../models/user')
var jwt = require('jsonwebtoken')
var env = require('../configs/env')

module.exports = {
    getToken: function (headers) {
        if (headers && headers.authorization) {
            var parted = headers.authorization.split(' ')
            if (parted.length === 2) {
                return parted[1]
            } else {
                return null
            }
        } else {
            return null
        }
    },
    getUserByEmail: function (email) {
        return new Promise(function (resolve, reject) {
            User.findOne({ email: email }, function (err, user) {
                resolve(user)
            })
        })
    },
    verifyToken: async function (token) {
        if (!token)
            return res.status(403).send({ auth: false, message: 'No token provided.' });

        var data = await jwt.verify(token, env.secret, function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    status: 401,
                    code: 'AUTH-FAILED',
                    msg: 'Failed to authenticate token.'
                })
            } else {
                return decoded
            }
        })
        return data
    }
}
