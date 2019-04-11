const Response = require('../helpers/response')
const JWT = require('../helpers/auth-jwt')
const utils = require('../helpers/utils')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')
const User = require('../models/user')

const validateToken = async (req, res) => {
    try {
        let token = utils.getToken(req.headers)
        if (token) {
            let decoded = await JWT.verifyToken(token, res)
            Response.successResponse(res, 200, 'USERS-SERVICE', 'Token Valid', decoded)
        }
    } catch (error) {
        res.send(error)
    }
}

const signup = async (req, res, next) => {
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return Response.failedResponse(res, 404, 'SIGNUP-SERVICE','Error in validation input data', errors.array())
    }

    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name
            })
            return user.save()
        })
        .then(result => {
            Response.successResponse(res, 201, 'SIGNUP-SERVICE', 'Signup user successful', result)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

const login = async (req, res, next) => {
    try {
        let email = req.body.email
        let password = req.body.password

        let user = await User.findOne({email: email})
        if (!user) {
            const error = new Error('A user with this email could not be found.')
            error.statusCode = 401
            throw error
        } else {
            let isEqual = await bcrypt.compare(password, user.password)
            if (!isEqual) {
                const error = new Error('Wrong password login!')
                error.statusCode = 401
                throw error
            }
            let userPayload = {
                email: user.email,
                status: user.status
            }
            let token = await JWT.generateToken({
                exp: 3600,
                sub: userPayload
            })
            Response.successResponse(res, 200, 'SIGNUP-SERVICE', 'Authentication Success', {token: token})
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

const loginV2 = async (req, res, next) => {
    try {
        let email = req.body.email
        let password = req.body.password

        let user = await User.findOne({ email: email })
        if (!user) {
            const error = new Error('A user with this email could not be found.')
            error.statusCode = 401
            throw error
        } else {
            let isEqual = await bcrypt.compare(password, user.password)
            if (!isEqual) {
                const error = new Error('Wrong password login!')
                error.statusCode = 401
                throw error
            }
            let userPayload = {
                email: user.email,
                status: user.status
            }
            let token = await JWT.getToken(userPayload)
            Response.successResponse(res, 200, 'SIGNUP-SERVICE', 'Authentication Success', { token: token })
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
        console.log(err)
        
    }
}

module.exports = {
    validateToken,
    signup,
    login,
    loginV2
}