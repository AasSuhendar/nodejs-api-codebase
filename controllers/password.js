const Response = require('../helpers/response')
const utils = require('../helpers/utils')
const env = require('../configs/env')

const User = require('../models/user')

const forgotPassword = async (req, res) => {
    let errorValidate = utils.validateResult(req, res)

    if (errorValidate) {
        Response.failedResponse400(req, res, 'USERS-SERVICE', 'Error in validation input data', errorValidate)
    } else {
        let { email } = req.body
    }
}

module.exports = {

}