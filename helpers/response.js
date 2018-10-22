const failedResponse403 = (req = '', res = '', code = '', msg = '') => {
    return res.status(403).send({
        status: false,
        statusCode: 403,
        code: code,
        msg: msg
    })
}

const failedResponse404 = (req = '', res = '', code = '', msg = '') => {
    return res.status(404).send({
        status: false,
        statusCode: 404,
        code: code,
        message: msg
    });
}

const failedResponse400 = (req = '', res = '', code = '', msg = '', err = {}) => {
    return res.status(400).send({
        status: false,
        statusCode: 400,
        code: code,
        message: msg,
        error: err
    });
}

const failedResponse500 = (req = '', res = '', code = '', msg = '', err = {}) => {
    return res.status(500).send({
        status: false,
        statusCode: 500,
        code: code,
        message: msg,
        error: err
    });
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

const successResponse200 = (req = '', res = '', code = '', msg = '', data = '') => {
    return res.status(200).send({
        status: true,
        statusCode: 200,
        code: code,
        msg: msg,
        data: data
    })
}


module.exports = {
    failedResponse403,
    failedResponse404,
    failedResponse400,
    failedResponse500,
    successResponse200Login,
    successResponse200
}