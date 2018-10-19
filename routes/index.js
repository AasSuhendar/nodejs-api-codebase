const express = require('express');
const router = express.Router();
const auth = require('../helpers/auth')
const Response = require('../helpers/response')
const JWT = require('../helpers/jwt')
const utils = require('../helpers/utils')

const User = require('../models/user')

router.get('/', function (req, res, next) {
  // User.find({}).then(user => res.send(user))
  // response.failedResponse403(req, res, 'AUTH', 'Auth failed')
  res.send({ statusCode: 200, msg: 'Wellcome main endpoint API' })
});

router.get('/private-basic', auth.AuthenticatedBasic,
  function (req, res) {
    res.json(req.user)
  })

router.post('/private-basic', auth.AuthenticatedBasic,
  function (req, res) {
    res.json(req.user)
  })

router.post('/login',
  async function (req, res) {
    let { email, password } = req.body

    try {
      let user = await User.findOne({ email: email })

      if (!user) {
        Response.failedResponse403(req, res, 'USERS-SERVICE', 'Authentication failed. User not found.')
      }

      user.comparePassword(password, async (err, isMatch) => {

        if (isMatch && !err) {
          var userlogin = {
            _id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            token: user.token,
            verified: user.verified,
            openshift: user.openshift,
            verified_aws: user.verified_aws,
            created_at: user.created_at,
            user_type: user.user_type,
            // openshift_data: openshiftData
          }
          let data = {
            email: user.email,
            name: user.name,
            token: user.token,
            openshift: user.openshift,
          }

          let token = await JWT.generateToken({ exp: 3600, sub: userlogin })

          Response.successResponse200Login(req, res, 'USERS-SERVICE', 'Authentication Success.', data, token)

        } else {
          Response.failedResponse403(req, res, 'USERS-SERVICE', 'Authentication failed. Wrong password.')
        }
      })

    } catch (error) {
      console.log(error);
      res.send(error)
    }
  })

router.get('/secure-area', auth.AuthenticatedJWT,
  async function (req, res) {
    let token = utils.getToken(req.headers)
    
    if (token) {
    
      let decoded = await JWT.verifyToken(token)
      res.send(decoded)
    }
  })

module.exports = router;
