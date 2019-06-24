/* eslint-disable quotes */
const Response = require('../helpers/response')
const Slack = require('../helpers/slack')

const postNotifSlack = async (req, res) => {
    try {
        let nameproject='aas-dev-test'
        let email='aas@gmal.com'
        let project_info='lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum'
        let message = `Incoming order project openshift \n> • Email : ${email}\n> • Name Project : ${nameproject}\n> • Project Info : ${project_info}`

        let notification = {
            text: 'Hallo admin, ada order masuk. mohon di cek😎',
            title: 'Order Project Openshift',
            message: message,
            order : {
                email: email,
                project_name: nameproject,
            }
        }
        let status = await Slack.sendWebHook(notification)
        Response.successResponse(res, 200, 'SLACK-WEBHOOK-INCOMING', 'Notification Send to Slack succecfull', status)
    } catch (error) {
        Response.failedResponse(res, error.statusCode, error.code, error.message)
    }
}

module.exports = {
    postNotifSlack,
}