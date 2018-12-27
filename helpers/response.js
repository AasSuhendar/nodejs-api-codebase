const failedResponse = (req = '', res = '', statusCode = '', code = '', msg = '', err = {}) => {
    return res.status(statusCode).json({
        status: false,
        statusCode: statusCode,
        code: code,
        message: msg,
        error: err
    });
}

const successResponse = (req = '', res = '', statusCode = '', code = '', msg = '', data = '') => {
    return res.status(statusCode).json({
        status: true,
        statusCode: statusCode,
        code: code,
        msg: msg,
        data: data
    })
}

module.exports = {
    successResponse,
    failedResponse
}