const getIndex = async (req, res) => {
    res.send({
        status: true,
        statusCode: 200,
        msg: 'Wellcome main endpoint API Todos Service'
    })
}

module.exports = {
    getIndex
}