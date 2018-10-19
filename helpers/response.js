const failedResponse403 = (req = '', res = '', code = '', msg = '') => {
    return res.status(403).send({
        status: false,
        statusCode: 403,
        code: code,
        msg: msg
    })
}

const successResponse200Login = (req = '', res = '', code = '', msg = '', data = {}, token = '') => {
    return res.status(200).send({
        status: true,
        statusCode: 200,
        code: code,
        msg: msg,
        data: data,
        token: token
    })
}


module.exports = {
    failedResponse403,
    successResponse200Login
}