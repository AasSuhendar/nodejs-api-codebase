const auth = require('../helpers/auth-jwt')
const User = require('../models/user')
const Response = require('../helpers/response')

const getSecure = async (req, res) => {
    let dataClaims = auth.getClaims(res.get('X-JWT-Claims'))
    res.send({
        status: true,
        statusCode: 200,
        msg: 'Wellcome to secure api ' + dataClaims.data.user
    })
}

const getUsers = async (req, res) => {
    try {
        let listUser = await User.find({})
        if (!listUser) {
            const error = new Error('List User not found.')
            error.statusCode = 404
            error.code = 'USERS-SERVICE'
            throw error
        } else {
            Response.successResponse(res, 200, 'USERS-SERVICE', 'Get List Users Success.', listUser)
        }
    } catch (error) {
        Response.failedResponse(res, error.statusCode, error.code, error.message)
    }
}

const getUser = async (req, res) => {
    try {
        let aUser = await User.findById({
            _id: req.params.id
        })
        if (!aUser) {
            Response.failedResponse(res, 404, 'USERS-SERVICE', 'Get User Failed, user not found with this id', aUser)
        } else {
            Response.successResponse(res, 200, 'USERS-SERVICE', 'Get User Success.', aUser)
        }
    } catch (err) {
        const error = new Error('Get User Failed.')
        error.statusCode = 400
        error.code = 'User-SERVICE'
        error.err = err
        Response.failedResponse(res, error.statusCode, error.code, error.message, err.message)
    }
}

const putUser = async (req, res) => {
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: req.body 
            }, { new: true })
        if (!user) {
            Response.failedResponse(res, 404, 'User-SERVICE', 'Update Users Failed, User not found with this id', user)
        } else {
            Response.successResponse(res, 200, 'User-SERVICE', 'Update Users Success', user)
        }
    } catch (err) {
        const error = new Error('Update Users Failed.')
        error.statusCode = 400
        error.code = 'Users-SERVICE'
        error.err = err
        Response.failedResponse(res, error.statusCode, error.code, error.message, err.message)
    }
}

const delUser = async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            Response.failedResponse(res, 400, 'USER-SERVICE', 'Delete User Failed', user)
        } else {
            Response.successResponse(res, 200, 'USER-SERVICE', 'Delete User Success', user)
        }
    } catch (err) {
        const error = new Error('Delete User Failed.')
        error.statusCode = 400
        error.code = 'USERS-SERVICE'
        error.err = err
        Response.failedResponse(res, error.statusCode, error.code, error.message, err.message)
    }
}

module.exports = {
    getSecure,
    getUsers,
    getUser,
    putUser,
    delUser
}