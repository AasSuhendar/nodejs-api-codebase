const express = require('express')
const router = express.Router()
const IndexController = require('../controllers/index')
const ProducerController = require('../controllers/producer')
const auth = require('../helpers/auth-jwt')
/**
 * @swagger
 * definitions:
 *   MainEndPoint:
 *     properties:
 *       status:
 *         type: boolean
 *       statusCode:
 *         type: integer
 *       msg:
 *         type: string
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Main Endpoint Users-Service
 *     description: Returns info main endpoint status
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An JSON status
 *         schema:
 *           $ref: '#/definitions/MainEndPoint'
 */
router.get('/', IndexController.getIndex)

/**
 * @swagger
 * /api/health/liveness:
 *   get:
 *     tags:
 *       - Health Check
 *     description: Returns liveness status
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *       503:
 *         description: Service Unavailable
 */

/**
 * @swagger
 * /api/health/readiness:
 *   get:
 *     tags:
 *       - Health Check
 *     description: Returns readiness status
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *       503:
 *         description: Service Unavailable
 */

router.get('/health', IndexController.healthCheck)
router.get('/secure', auth.AuthenticateJWT, IndexController.getSecure)
router.post('/sendMessage', ProducerController.sendMessage)
router.post('/sendMessageMultiply', ProducerController.sendMessageMultiply)

module.exports = router