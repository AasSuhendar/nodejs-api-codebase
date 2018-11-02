const Response = require('../helpers/response')
const JWT = require('../helpers/jwt')
const utils = require('../helpers/utils')
const env = require('../configs/env')
const axios = require('axios')

const User = require('../models/user')

const login = async (req, res) => {
    let errorValidate = utils.validateResult(req, res)
    if (errorValidate) {
        Response.failedResponse400(req, res, 'USERS-SERVICE', 'Error in validation input data', errorValidate)
    } else {
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
                            let openshiftData, statusOpenshift
                            let result = await utils.getOpenshiftToken(email, password)

                            if (result.success && result.status === 200) {
                                openshiftData = result.data
                                statusOpenshift = true
                            } else {
                                openshiftData = result.data
                                statusOpenshift = false
                            }

                            var userlogin = {
                                _id: user.id,
                                name: user.name,
                                email: user.email,
                                phone_number: user.phone_number,
                                token: user.token,
                                verified: user.verified,
                                openshift: user.openshift,
                                verified_aws: user.verified_aws,
                                created_at: user.created_at,
                                user_type: user.user_type,
                                openshift_data: openshiftData
                            }
                            let data = {
                                email: user.email,
                                name: user.name,
                                token: user.token,
                                openshift: user.openshift,
                                active_openshift: statusOpenshift,
                            }

                            let token = await JWT.generateToken({ exp: 3600, sub: userlogin })
                            Response.successResponse200Login(req, res, 'USERS-SERVICE', 'Authentication Success.', data, token)
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

const adminLogin = async (req, res) => {
    let errorValidate = utils.validateResult(req, res)
    if (errorValidate) {
        Response.failedResponse400(req, res, 'USERS-SERVICE', 'Error in validation input data', errorValidate)
    } else {
        try {
            let { email, password } = req.body
            let user = await User.findOne({ email: email })
            if (!user) {
                Response.failedResponse403(req, res, 'USERS-SERVICE', 'Authentication failed. User not found.')
            } else {
                user.comparePassword(password, async (err, isMatch) => {
                    if (!err && isMatch) {
                        if (user.verified && env.adminAccess.includes(email)) {
                            let openshiftData, statusOpenshift
                            let result = await utils.getOpenshiftToken(email, password)

                            if (result.success && result.status === 200) {
                                openshiftData = result.data
                                statusOpenshift = true
                            } else {
                                openshiftData = result.data
                                statusOpenshift = false
                            }

                            var userlogin = {
                                _id: user.id,
                                name: user.name,
                                email: user.email,
                                phone_number: user.phone_number,
                                token: user.token,
                                verified: user.verified,
                                openshift: user.openshift,
                                verified_aws: user.verified_aws,
                                created_at: user.created_at,
                                user_type: user.user_type,
                                openshift_data: openshiftData
                            }
                            let data = {
                                email: user.email,
                                name: user.name,
                                token: user.token,
                                admin: true,
                                openshift: user.openshift,
                                active_openshift: statusOpenshift,
                            }

                            let token = await JWT.generateToken({ exp: 3600, sub: userlogin })
                            Response.successResponse200Login(req, res, 'USERS-SERVICE', 'Authentication Success.', data, token)
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
    adminLogin,
    validateToken,
    verifi
}