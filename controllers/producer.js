const kafkaEvent = require('../helpers/event-kafka')

const sendMessage = async (req, res) => {
    try {
        let data = req.body
        
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

const sendMessageMultiply = async (req, res) => {
    try {
        let loopingSize = req.body.looping_size
        let messages = []
        for (let index = 0; index < loopingSize ; index++) {
            let objdata = {
                key: req.body.key,
                value: JSON.stringify({
                    id: index,
                    name: 'User' + index,
                    emal: 'emailUser' + index + '@sample.com'
                }),
                partition: req.body.partition
            }
            messages.push(objdata)
        }

        let send = await kafkaEvent.sendMessageMultiplyProducer(req.body.key, req.body.topic, req.body.partition, messages)

        if (send) {
            res.send({
                status: true,
                statusCode: 200,
                msg: 'Message send to queue Kafka with '+loopingSize+' data'
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
    sendMessageMultiply
}