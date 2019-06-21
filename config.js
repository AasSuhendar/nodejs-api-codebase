const env = require('dotenv')
const convict = require('convict')

env.config()

// Configuration Schema
const schema = convict({
    env: {
        doc: 'The Application Environment',
        format: ['dev', 'prod', 'test'],
        default: 'dev',
        env: 'NODE_ENV'
    },
    server: {
        address: {
            doc: 'The Application Address to Listen',
            format: 'ipaddress',
            default: '0.0.0.0',
            env: 'NODE_SERVER_ADDRESS'
        },
        port: {
            doc: 'The Application Port to Listen',
            format: 'port',
            default: 3000,
            env: 'NODE_SERVER_PORT'
        },
        upload: {
            path: {
                doc: 'The Application Upload Path',
                format: String,
                default: './uploaded',
                env: 'NODE_SERVER_UPLOAD_PATH'
            }
        }
    },
    log: {
        level: {
            doc: 'The Application Log Level',
            format: ['debug', 'verbose', 'info', 'warn', 'error'],
            default: 'info',
            env: 'NODE_LOG_LEVEL'
        }
    },
    jwt: {
        expired: {
            doc: 'JWT Authentication Expiration',
            format: String,
            default: '1h',
            env: 'JWT_EXPIRED'
        }
    },
    db: {
        driver: {
            doc: 'Database Driver',
            format: String,
            default: '',
            env: 'DB_DRIVER'
        },
        host: {
            doc: 'Database Host',
            format: '*',
            default: '',
            env: 'DB_HOST'
        },
        port: {
            doc: 'Database Port',
            format: 'port',
            default: '',
            env: 'DB_PORT'
        },
        username: {
            doc: 'Database Username',
            format: String,
            default: '',
            env: 'DB_USERNAME'
        },
        password: {
            doc: 'Database Password',
            format: String,
            default: '',
            env: 'DB_PASSWORD'
        },
        name: {
            doc: 'Database Name',
            format: String,
            default: '',
            env: 'DB_NAME'
        }
    },
    store: {
        driver: {
            doc: 'Storage Driver',
            format: String,
            default: '',
            env: 'STORE_DRIVER'
        },
        endPoint: {
            doc: 'Storage Endpoint',
            format: String,
            default: '',
            env: 'STORE_ENDPOINT'
        },
        accessKey: {
            doc: 'Storage Access Key',
            format: String,
            default: '',
            env: 'STORE_ACCESS_KEY'
        },
        secretKey: {
            doc: 'Storage Secret Key',
            format: String,
            default: '',
            env: 'STORE_SECRET_KEY'
        },
        region: {
            doc: 'Storage Region',
            format: String,
            default: 'us-east-1',
            env: 'STORE_REGION'
        },
        bucket: {
            doc: 'Storage Bucket',
            format: String,
            default: '',
            env: 'STORE_BUCKET'
        },
        port: {
            doc: 'Storage Port',
            format: 'port',
            default: 443,
            env: 'STORE_PORT'
        },
        useSSL: {
            doc: 'Storage Use SSL',
            format: Boolean,
            default: false,
            env: 'STORE_USE_SSL'
        }
    },
    event: {
        driver: {
            doc: 'Event Driver',
            format: String,
            default: 'kafka',
            env: 'EVENT_DRIVER'
        },
        host: {
            doc: 'Event Host',
            format: '*',
            default: '0.0.0.0',
            env: 'EVENT_HOST'
        },
        port: {
            doc: 'Event port',
            format: 'port',
            default: '',
            env: 'EVENT_PORT'
        },
    },
    slack: {
        webhook_url: {
            doc: 'Slack WebHook URL',
            format: String,
            default: '',
            env: 'SLACK_WEBHOOK_URL'
        },
        client_secret: {
            doc: 'Slack Event Host',
            format: '*',
            default: '',
            env: 'SLACK_CLIENT_SECRET'
        },
        signing_secret: {
            doc: 'Slack Signing Secret',
            format: String,
            default: '',
            env: 'SLACK_SIGNING_SECRET'
        },
    },
    elastic: {
        apm_url: {
            doc: 'APM URL',
            format: String,
            default: '',
            env: 'APM_URL'
        },
        elastic_url: {
            doc: 'Elasticsearch URL',
            format: '*',
            default: '',
            env: 'ELASTIC_URL'
        },
        kibana_url: {
            doc: 'Kibana URL',
            format: String,
            default: '',
            env: 'KIBANA_URL'
        },
        logstash_url: {
            doc: 'Logstash URL',
            format: String,
            default: '',
            env: 'LOGSTASH_URL'
        },
    }
})

schema.loadFile('./configs/' + schema.get('env') + '.json')
schema.validate({ allowed: 'strict' })

module.exports = {
    schema
}
