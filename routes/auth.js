const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const auth = require('../helpers/auth')
const Response = require('../helpers/response')
const JWT = require('../helpers/jwt')
const utils = require('../helpers/utils')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

router.get('/private-basic', auth.AuthenticatedBasic,
    function (req, res) {
        res.json(req.user)
    })

router.post('/private-basic', auth.AuthenticatedBasic,
    function (req, res) {
        res.json(req.user)
    })

router.post('/login', [
    body('email').isEmail(),
    body('password').not().isEmpty().trim().escape()
], AuthController.login)

router.get('/validate-token', auth.AuthenticatedJWT,
    async function (req, res) {
        try {
            let token = utils.getToken(req.headers)

            if (token) {
                let decoded = await JWT.verifyToken(token)
                Response.successResponse200(req, res, 'USERS-SERVICE', 'Token Valid', decoded)
            }
        } catch (error) {
            res.send(error)
        }

    })

module.exports = router;
