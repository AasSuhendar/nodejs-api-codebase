const kafkaEvent = require('../helpers/event-kafka')

const consumerEvent = async () => {
    try {
        const consumerConfig = {
            clientIdConsumer: 'KafkaConsumer1',
            groupIdConsumer: 'consumerGroup1'
        }

        // let consumer = await kafkaEvent.consumeMessage('send-email-activation-user')
        let consumer = await kafkaEvent.runKafkaConsumer(consumerConfig)
        await consumer.subscribe({ topic:'sample-topic-test'})
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
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

const consumerEventNotif = async () => {
    try {
        const consumerConfig = {
            clientIdConsumer: 'playcourtKafkaConsumer2',
            groupIdConsumer: 'playcourtNotificationVerify'
        }

        let consumer = await kafkaEvent.runKafkaConsumer(consumerConfig)
        await consumer.subscribe({ topic: 'send-email-verification-user' })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
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
    consumerEventNotif
}