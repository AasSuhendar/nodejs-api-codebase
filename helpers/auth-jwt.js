const env = require('../configs/env')
const uuid = require('uuid/v4')
const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const crypt = require('../helpers/crypt')
const Logger = require('../helpers/logger')


// const private_key = env.private_key
// const public_key = env.public_key

const jwtOptions = {
    expiresIn: '1h',
    algorithm: 'RS256'
}
// -------------------------------------------------
// Auth JWT Middleware Function
function AuthenticateJWT(req, res, next) {
    // Check HTTP Header Authorization Section
    // The First Authorization Section Should Contain "Bearer "
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        Logger.logger('http-access').warn('Unauthorized Method ' + req.method + ' at URI ' + req.url)
        response.resUnauthorized(res)
        return
    }

    // The Second Authorization Section Should Be The Credentials Payload
    let authPayload = req.headers.authorization.split(' ')[1]

    // Get Authorization Claims From JWT Token
    // And Stringify Data to JSON Format
    let authClaims = JSON.stringify(jwt.verify(authPayload, crypt.keyPublic, jwtOptions))
    // Set Extracted Authorization Claims to HTTP Header
    // With RSA Encryption
    res.set('X-JWT-Claims', crypt.encryptWithRSA(authClaims))
    // Call Next Handler Function With Current Request
    next()
}

// -------------------------------------------------
// Get JWT Token Function
function getToken(payload) {
    return jwt.sign({ data: payload }, crypt.keyPrivate, jwtOptions)
}


// -------------------------------------------------
// Get JWT Claims Function
function getClaims(data) {
    return JSON.parse(crypt.decryptWithRSA(data))
}

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
    AuthenticateJWT,
    getToken,
    getClaims,
    generateToken,
    verifyToken
}