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
  res.send({ status: true ,statusCode: 200, msg: 'Wellcome main endpoint API Users Service' })
});

/**
 * @swagger
 * /api/health/liveness:
 *   get:
 *     tags:
 *       - Health Liveness Probe
 *     description: Returns liveness status
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A return status liveness with status code 200
 */

/**
 * @swagger
 * /api/health/readiness:
 *   get:
 *     tags:
 *       - Health Readiness Probe
 *     description: Returns readiness status
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A return status liveness with status code 200
 */

module.exports = router;
