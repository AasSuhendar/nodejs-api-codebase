const BasicStrategy = require('passport-http').BasicStrategy;
const passport = require('passport');
const utils = require('./utils')
const JWT = require('./jwt')

passport.use(new BasicStrategy(
    async function (user, password, done) {

        if (user == 'user' && password == 'password') {
            userPayload = {
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
));

const AuthMiddleware = async (req, res, next) => {
    let {
        authorization = null
    } = req.headers

    if (authorization == null) {
        res.status(403).send('Unauthorized')
    } else {
        let typeAuth = authorization.split(" ")[0]
        let token = authorization.split(" ")[1]

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

module.exports = {
    AuthenticatedBasic: passport.authenticate(['basic'], {
        session: false
    }),
    AuthMiddleware
}