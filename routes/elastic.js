const express = require('express')
const router = express.Router()
const elasticController = require('../controllers/elasticsearch')

router.get('/query/:param', elasticController.getDatabyParam)
router.post('/createIndex', elasticController.postCreateIndex)
router.post('/add/:indexname/:type', elasticController.addDocument)
router.post('/add/:indexname/:type/:id', elasticController.addDocument)

module.exports = router