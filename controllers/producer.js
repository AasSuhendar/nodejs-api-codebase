const kafkaEvent = require('../helpers/event-kafka')

const sendMessage = async (req, res) => {
    try {
        let data = {
            name: req.body.name,
            email: req.body.email,
            status: req.body.status
        }
        
        let send = await kafkaEvent.sendMessageProducer(req.body.key, req.body.topic, req.body.partition, data)
        
        if (send) {
            res.send({
                status: true,
                statusCode: 200,
                msg: 'Message send to queue Kafka'
            })
        } else {
            res.send({
                status: false,
                statusCode: 500,
                msg: 'Message failed send to queue Kafka'
            })
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    sendMessage,
}