const express = require('express');
const router = express.Router();
const {
    body
} = require('express-validator/check');
const auth = require('../helpers/auth')

const AuthController = require('../controllers/auth')

/**
 * @swagger
 * definitions:
 *   BasicAuth:
 *     properties:
 *       token:
 *         type: string
 */

/**
 * @swagger
 * securityDefinitions:
 *   basicAuth:
 *     type: basic
 *   APIKeyHeader:
 *     type: apiKey
 *     in: header
 *     name: Authorization
 */

/**
 * @swagger
 * /api/auth/private-basic:
 *   get:
 *     tags:
 *       - Auth
 *     description: Basic auth for login in console Openshift
 *     produces:
 *       - application/json
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: OK (successfully authenticated)
 *         schema:
 *           $ref: '#/definitions/BasicAuth'
 *       401:
 *         description: Unauthorized user with the specified ID was not found.
 *   post:
 *     tags:
 *       - Auth
 *     description: Basic auth for login in console Openshift
 *     produces:
 *       - application/json
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: OK (successfully authenticated)
 *         schema:
 *           $ref: '#/definitions/BasicAuth'
 *       401:
 *         description: Unauthorized user with the specified ID was not found.
 */
router.get('/private-basic', auth.AuthenticatedBasic,
    function (req, res) {
        res.json(req.user)
    })

router.post('/private-basic', auth.AuthenticatedBasic,
    function (req, res) {
        res.json(req.user)
    })

/**
 * @swagger
 * /api/auth/validate-token:
 *   get:
 *     tags:
 *       - Auth
 *     description: Validate token is valid token
 *     produces:
 *       - application/json
 *     security:
 *       - APIKeyHeader: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Unauthorized
 */
router.get('/validate-token', auth.AuthMiddleware, AuthController.validateToken)


module.exports = router;