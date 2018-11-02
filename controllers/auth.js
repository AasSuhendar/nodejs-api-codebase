const Response = require('../helpers/response')
const JWT = require('../helpers/jwt')
const utils = require('../helpers/utils')
const auth = require('../helpers/auth')
const env = require('../configs/env')
const axios = require('axios')

const User = require('../models/user')

const login = async (req, res) => {
    let errorValidate = utils.validateResult(req, res)
    if (errorValidate) {
        Response.failedResponse400(req, res, 'USERS-SERVICE', 'Error in validation input data', errorValidate)
    } else {
        let { role } = req.params
        let { email, password } = req.body
        
        try {
            let user = await User.findOne({ email: email })

            if (!user) {
                Response.failedResponse403(req, res, 'USERS-SERVICE', 'Authentication failed. User not found.')
            } else {
                user.comparePassword(password, async (err, isMatch) => {
                    if (isMatch && !err) {
                        if (!user.verified) {
                            Response.failedResponse403(req, res, 'USERS-SERVICE', 'Your account is not active. Please activate your account by clicking the link already sent to your email when registration.')
                        } else {
                            
                            let data = {
                                email: user.email,
                                name: user.name,
                                token: user.token,
                                openshift: user.openshift,
                            }

                            let userlogin = await auth.setPayload(role, user, email, password)
                            let token = await JWT.generateToken({ exp: 3600, sub: userlogin })

                            if (role == "admin" && env.adminAccess.includes(email)) {
                                data.admin = true
                                data.active_openshift = userlogin.openshift_status
                                Response.successResponse200Login(req, res, 'USERS-SERVICE', 'Authentication Success.', data, token)
                            } else if ((role != "admin" && !env.adminAccess.includes(email)) || role != "admin") {
                                data.active_openshift = userlogin.openshift_status
                                Response.successResponse200Login(req, res, 'USERS-SERVICE', 'Authentication Success.', data, token)
                            } else {
                                Response.failedResponse403(req, res, 'USERS-SERVICE', 'Unauthorized for login as Admin.')
                            }
                        }
                    } else {
                        Response.failedResponse403(req, res, 'USERS-SERVICE', 'Authentication failed. Wrong password.')
                    }
                })
            }
        } catch (error) {
            return res.status(500).send(error)
        }
    }
}

const validateToken = async (req, res) => {
    try {
        let token = utils.getToken(req.headers)
        if (token) {
            let decoded = await JWT.verifyToken(token)
            Response.successResponse200(req, res, 'USERS-SERVICE', 'Token Valid', decoded)
        }
    } catch (error) {
        res.send(error)
    }
}

const verifi = async (req, res) => {
    await axios.post('http://localhost:3003/api/mailer/send-verification', {
        name: 'aas',
        email: 'aas.suhendar@gmail.com',
        token: 'sahdajd98a09s8ds0a',
    })
        .then(resp => {
            console.log(resp);
            res.send(resp)
        }).catch(err => {
            console.log(err);
        })
}

module.exports = {
    login,
    validateToken,
    verifi
}