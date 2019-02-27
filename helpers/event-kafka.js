const { Kafka, CompressionTypes, logLevel } = require('kafkajs')
const config = require('../config')
const Logger = require('../helpers/logger')

let producer
let consumer

const kafkaConnection = ({hostBroker, portBroker, clientId}) => {
    const kafka = new Kafka({
        logLevel: logLevel.INFO,
        brokers: [`${hostBroker}:${portBroker}`],
        clientId: clientId,
    })
    return kafka
}

const runKafkaProducer = async ({clientIdProducer}) => {
    try {
        let option = {
            hostBroker: config.schema.get('event.host'),
            portBroker: config.schema.get('event.port'),
            clientId: clientIdProducer,
        }
        
        // Witout Partitioner Setting
        // producer = kafkaConnection(option).producer()

        // With Partitioner Setting
        producer = kafkaConnection(option).producer({ createPartitioner: customPartitioner })

        await producer.connect()
        Logger.logger('kafka-event').info('Kafka Producer is connected and ready.')
        disconnectKafka()
    } catch (err) {
        Logger.logger('kafka-event').error(err)
    }
}

const disconnectKafka = async () => {
    const errorTypes = ['unhandledRejection', 'uncaughtException']
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

    errorTypes.map(type => {
        return process.on(type, async () => {
            try {
                Logger.logger('kafka-event').warn(`process.on ${type} occured on producer and consumer Event Kafka`)
                await producer.disconnect()    
                await consumer.disconnect()    
                return process.exit(0)
            } catch (_) {
                process.exit(1)
            }
        })
    })

    signalTraps.map(type => {
        return process.once(type, async () => {
            try {
                Logger.logger('kafka-event').warn(`process.on ${type} occured on producer and consumer Event Kafka`)
                await producer.disconnect()
                await consumer.disconnect()
            } finally {
                process.kill(process.pid, type)
            }
        })
    })
}

const runKafkaConsumer = async ({clientIdConsumer,groupIdConsumer}) => {
    try {
        let optionConsumer = {
            groupId: groupIdConsumer
        }
        let option = {
            hostBroker: config.schema.get('event.host'),
            portBroker: config.schema.get('event.port'),
            clientId: clientIdConsumer,
        }
        consumer = kafkaConnection(option).consumer(optionConsumer)
        await consumer.connect()
        disconnectKafka()
    } catch (err) {
        Logger.logger('kafka-event').error(err)
    }
}

const customPartitioner = () => {
    return ({ topic, partitionMetadata, message }) => {
        // select a partition based on some logic
        // return the partition number
        console.log(topic);
        console.log(message);
        
        if (message.key === 'key-event1') {
            return 0    
        } else {
            return 1
        }
        
    }
}

const sendMessageProducer =  async (key, topic, data) => {
    try {
        let valueMessage = new Buffer.from(JSON.stringify(data))
        await producer.send({
            topic,
            compression: CompressionTypes.GZIP,
            messages: [{
                key: key,
                value: valueMessage
            }]
        })
    } catch (err) {
        Logger.logger('kafka-event').error(err)
    }
}


const consumeMessage = async (topic) => {
    await consumer.subscribe({ topic: topic })
    return consumer
}

const deleteTopic = async (topic) => {
    let option = {
        hostBroker: config.schema.get('event.host'),
        portBroker: config.schema.get('event.port'),
        clientId: 'todoKafka',
    }
    let admin = kafkaConnection(option).admin()
    await admin.connect()
    await admin.deleteTopics({
        topics: topic,
        timeout: 5000,
    })
}

module.exports = {
    runKafkaProducer,
    runKafkaConsumer,
    sendMessageProducer,
    consumeMessage,
    deleteTopic
}