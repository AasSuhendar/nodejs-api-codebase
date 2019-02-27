const kafkaEvent = require('../helpers/event-kafka')

const sendMessage = async (req, res) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        status: req.body.status
    }
    let producer = kafkaEvent.sendMessageProducer(req.body.key,req.body.topic, data)
    if (producer) {
        res.send({
            status: true,
            statusCode: 200,
            msg: 'Message send to queue Kafka'
        })
    } else {
        res.send({
            status: false,
            statusCode: 500,
            msg: 'Message send to queue Kafka'
        })
    }
}

const deleteTopic = async (req, res) => {
    let topic = req.body.topic
    let data = kafkaEvent.deleteTopic(topic)
    console.log(data)
    res.send(data)
}

module.exports = {
    sendMessage,
    deleteTopic
}