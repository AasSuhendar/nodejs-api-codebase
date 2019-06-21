const { IncomingWebhook } = require('@slack/webhook')
const config = require('../config')
const url = config.schema.get('slack.webhook_url')
const webhook = new IncomingWebhook(url)
const Response = require('../helpers/response')

const postNotifSlack = async (req, res) => {
    try {
        await webhook.send({
            'text': 'Hallo Bro ada order 😎',
            'attachments': [
                {
                    // 'fallback': 'Order Project Openshift',
                    // 'author_name': 'support@playcourt.id',
                    'title': 'Order Project Openshift',
                    'text': 'Incoming order project openshift from \n\n Name : aas-projecy-dev\n Email: aas.suhendar@gmail.com',
                }
            ]
        })
        Response.successResponse(res, 200, 'SLACK-WEBHOOK-INCOMING', 'Notification Send to Slack succecfull')
    } catch (error) {
        Response.failedResponse(res, error.statusCode, error.code, error.message)
    }
}

module.exports = {
    postNotifSlack,
}