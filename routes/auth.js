const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const auth = require('../helpers/auth')

const AuthController = require('../controllers/auth')

/**
 * @swagger
 * definitions:
 *   BasicAuth:
 *     properties:
 *       sub:
 *         type: string
 *       preferred_username:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *   LoginUser:
 *     properties:
 *       status:
 *         type: boolean
 *       statusCode:
 *         type: number
 *       code:
 *         type: string
 *       msg:
 *         type: string
 *       data:
 *         type: object
 *       token:
 *         type: string
 *   Failed403:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *       statusCode:
 *         type: number
 *       code:
 *         type: string
 *       msg:
 *         type: string
 * 
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
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Auth login for user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Login user
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: OK (Authentication Success)
 *         schema:
 *           $ref: '#/definitions/LoginUser'
 *       403:
 *         description: Failed Login (Forbidden)
 *         schema: 
 *           $ref: '#/definitions/Failed403'
 *         
 */
router.post('/login', [
    body('email').isEmail(),
    body('password').not().isEmpty().trim().escape()
], AuthController.login)

/**
 * @swagger
 * /api/auth/login-admin:
 *   post:
 *     tags:
 *       - Auth
 *     description: Auth login for admin
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Login admin
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: OK (Authentication Success)
 *         schema:
 *           $ref: '#/definitions/LoginUser'
 *       403:
 *         description: Failed Login (Forbidden)
 *         schema: 
 *           $ref: '#/definitions/Failed403'
 *         
 */
router.post('/login-admin', [
    body('email').isEmail(),
    body('password').not().isEmpty().trim().escape()
], AuthController.adminLogin)
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
router.get('/validate-token', auth.AuthenticatedJWT, AuthController.validateToken)

router.get('/verify', AuthController.verifi)

module.exports = router;
