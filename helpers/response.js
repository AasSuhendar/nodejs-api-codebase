const failedResponse = (res = '', statusCode = '', code = '', msg = '', err = {}) => {
    return res.status(statusCode).json({
        status: false,
        statusCode: statusCode,
        code: code,
        message: msg,
        error: err
    })
}

const successResponse = (res = '', statusCode = '', code = '', msg = '', data = '') => {
    return res.status(statusCode).json({
        status: true,
        statusCode: statusCode,
        code: code,
        msg: msg,
        data: data
    })
}

// -------------------------------------------------
// Bad Request Response Function
const resBadRequest = (res, err) => {
    // Set Default Message
    err = err !== undefined ? err : 'Bad Request'
    // Write Response
    failedResponse(res, 400, 'AUTH', 'Unauthorized', { message: err })
}

// -------------------------------------------------
// Unauthorized Response Function
const resUnauthorized = (res) => {
    // Write Response
    failedResponse(res, 401, 'AUTH', 'Unauthorized', {message:'Unauthorized'})
}

// -------------------------------------------------
// Authenticate Response Function
const resAuthenticate = (res) => {
    res.set('WWW-Authenticate', 'Basic realm="Authorization Required"')
    resUnauthorized(res)
}

module.exports = {
    successResponse,
    failedResponse,
    resAuthenticate,
    resBadRequest,
    resUnauthorized
}