/* eslint-disable quotes */
const { IncomingWebhook } = require('@slack/webhook')
const config = require('../config')
const url = config.schema.get('slack.webhook_url')
const webhook = new IncomingWebhook(url)
const Logger = require('../helpers/logger')

const sendWebHook = async ({text, title, message, order}) => {
    try {
        await webhook.send({
            'text': text,
            'attachments': [
                {
                    'fallback': 'Order Project Openshift',
                    'author_name': 'support@playcourt.id',
                    'title': title,
                    'text': message,
                }
            ]
        })
        Logger.logger('slack-webhook').info(`Notification order project openshift with name ${order.project_name} send to slack `)
        return true
        
    } catch (err) {
        Logger.logger('slack-webhook').error(err)
    }
}

module.exports = {
    sendWebHook
}