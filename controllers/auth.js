const Response = require('../helpers/response')
const JWT = require('../helpers/jwt')
const utils = require('../helpers/utils')

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
                            // openshift_data: openshiftData
                        }
                        let data = {
                            email: user.email,
                            name: user.name,
                            token: user.token,
                            openshift: user.openshift,
                        }

                        let token = await JWT.generateToken({ exp: 3600, sub: userlogin })
                        Response.successResponse200Login(req, res, 'USERS-SERVICE', 'Authentication Success.', data, token)
                    } else {
                        Response.failedResponse403(req, res, 'USERS-SERVICE', 'Authentication failed. Wrong password.')
                    }
                })
            }
        } catch (error) {
            console.log(error);
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

module.exports = {
    login,
    validateToken
}