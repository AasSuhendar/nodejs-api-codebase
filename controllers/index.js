
const getIndex = async (req, res) => {
    res.send({ status: true, statusCode: 200, msg: 'Wellcome main endpoint API Users Service' })
    // res.send('Hello World!')
}

module.exports = {
    getIndex
}