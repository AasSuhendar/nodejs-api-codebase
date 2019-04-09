const BasicStrategy = require('passport-http').BasicStrategy
const passport = require('passport')
const JWT = require('./auth-jwt')
const Logger = require('../helpers/logger')
const response = require('../helpers/response')

passport.use(new BasicStrategy(
    async function (user, password, done) {

        if (user == 'user' && password == 'password') {
            let userPayload = {
                email: 'user',
            }
            let token = await JWT.generateToken({
                exp: 3600,
                sub: userPayload
            })
            let returnData = {
                token: token
            }
            return done(null, returnData)
        } else {
            return done(null, false)
        }
    }
))

const AuthMiddleware = async (req, res, next) => {
    let {
        authorization = null
    } = req.headers

    if (authorization == null) {
        res.status(403).send('Unauthorized')
    } else {
        let typeAuth = authorization.split(' ')[0]
        let token = authorization.split(' ')[1]

        if (typeAuth !== 'Bearer') {
            res.status(403).send('Unauthorized')
        } else if (!token) {
            res.status(403).send('Unauthorized')
        } else {
            try {
                let decode = JWT.verifyToken(token)
                req.user = decode
                next()
            } catch (error) {
                res.status(403).send('Unauthorized - Invalid Token')
            }
        }
    }
}

// Auth Basic Middleware Function
const AuthenticateBasic = async (req, res, next) => {
    // Check HTTP Header Authorization Section
    // The First Authorization Section Should Contain "Basic "
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        Logger.logger('http-access').warn('Unauthorized Method ' + req.method + ' at URI ' + req.url)
        response.resAuthenticate(res)
        return
    }

    // The Second Authorization Section Should Be The Credentials Payload
    // But We Should Decode it First From Base64 Encoding
    let authPayload = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8')

    // Split Decoded Authorization Payload Into Username and Password Credentials
    let authCredentials = authPayload.split(':')

    // Check Credentials Section
    // It Should Have 2 Section, Username and Password
    if (authCredentials.length !== 2) {
        Logger.logger('http-access').warn('Unauthorized Method ' + req.method + ' at URI ' + req.url)
        response.resBadRequest(res)
        return
    }

    // Make Credentials to JSON Format
    req.body = '{"username": "' + authCredentials[0] + '", "password": "' + authCredentials[1] + '"}'

    // Call Next Handler Function With Current Request
    next()
}

module.exports = {
    AuthenticatedBasic: passport.authenticate(['basic'], {
        session: false
    }),
    AuthenticateBasic,
    AuthMiddleware
}