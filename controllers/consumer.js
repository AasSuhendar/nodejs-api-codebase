const kafkaEvent = require('../helpers/event-kafka')

const consumerEvent = async () => {
    try {
        let consumer = await kafkaEvent.consumeMessage('topic-kafkajs')
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(message)
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                console.log(`- ${prefix} ${message.key}#${message.value}`)
                var data = JSON.parse(message.value)
                console.log(data)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    consumerEvent,
}