const express = require('express');
const router = express.Router();

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
router.get('/', function (req, res, next) {
  
});

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

module.exports = router;
