const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const auth = require('../helpers/auth-jwt')

router.get('/', auth.AuthenticateJWT, userController.getUsers)
router.get('/:id', auth.AuthenticateJWT, userController.getUser)
router.put('/:id', auth.AuthenticateJWT, userController.putUser)
router.delete('/:id', auth.AuthenticateJWT, userController.delUser)

module.exports = router