const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const auth = require('../helpers/auth')

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

router.get('/validate-token', auth.AuthenticatedJWT, AuthController.validateToken)

module.exports = router;
