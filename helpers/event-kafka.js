const { Kafka, CompressionTypes, logLevel } = require('kafkajs')
const config = require('../config')
const Logger = require('../helpers/logger')

// singleton producer
let producer

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
        producer = kafkaConnection(option).producer()

        // With Partitioner Setting
        // let producer = kafkaConnection(option).producer({ createPartitioner: customPartitioner })

        await producer.connect()
        Logger.logger('kafka-event').info('Kafka Producer is connected and ready.')
        disconnectKafka('producer', producer)
        // return producer
    } catch (err) {
        Logger.logger('kafka-event').error(err)
    }
}

const runKafkaConsumer = async ({ clientIdConsumer, groupIdConsumer }) => {
    try {
        let optionConsumer = {
            groupId: groupIdConsumer
        }
        let option = {
            hostBroker: config.schema.get('event.host'),
            portBroker: config.schema.get('event.port'),
            clientId: clientIdConsumer,
        }
        let consumer = kafkaConnection(option).consumer(optionConsumer)
        await consumer.connect()
        disconnectKafka('consumer', consumer)
        return consumer
    } catch (err) {
        Logger.logger('kafka-event').error(err)
    }
}

const disconnectKafka = async (mode,instance) => {
    const errorTypes = ['unhandledRejection', 'uncaughtException']
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

    errorTypes.map(type => {
        return process.on(type, async () => {
            try {
                Logger.logger('kafka-event').warn(`process.on ${type} occured on ${mode} Event Kafka`)
                Logger.logger('kafka-event').info(`Kafka ${mode} is stop`)
                await instance.disconnect()
                return process.exit(0)
            } catch (_) {
                process.exit(1)
            }
        })
    })

    signalTraps.map(type => {
        return process.once(type, async () => {
            try {
                Logger.logger('kafka-event').warn(`process.on ${type} occured on ${mode} Event Kafka`)
                Logger.logger('kafka-event').info(`Kafka ${mode} is stop`)
                await instance.disconnect()
            } finally {
                process.kill(process.pid, type)
            }
        })
    })
}

const customPartitioner = () => {
    return ({ topic, partitionMetadata, message }) => {
        // select a partition based on some logic
        // return the partition number
        if (message.key === 'key-partition0') {
            return 0    
        } else {
            return 1
        }
        
    }
}

const sendMessageProducer =  async (key, topic, partition, data) => {
    try {
        let valueMessage = new Buffer.from(JSON.stringify(data))
        let status = await producer.send({
            topic,
            compression: CompressionTypes.GZIP,
            messages: [{
                key: key,
                value: valueMessage,
                partition: partition
            }]
        })
        console.log(status);
        
        if (!status) {
            return false
        }
        return true
    } catch (err) {
        Logger.logger('kafka-event').error(err)
    }
}

module.exports = {
    runKafkaProducer,
    runKafkaConsumer,
    sendMessageProducer,
}