const env = require('../configs/env')
const uuid = require('uuid/v4')
const jwt = require('jsonwebtoken')

// const private_key = env.private_key
// const public_key = env.public_key

const generateToken = async ({ exp = 3600, sub = '' } = {}) => {
    
    let token = await jwt.sign({
        jti: uuid(),
        sub,
        exp: Math.floor(Date.now() / 1000) + exp,
    }, env.secret_key)
    return token
}

const verifyToken = (token) => {
    let decode = jwt.verify(token, env.secret_key)
    return decode
}

module.exports = {
    generateToken,
    verifyToken
}