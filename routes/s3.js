const express = require('express')
const router = express.Router()
const s3Controller = require('../controllers/s3')
const multerConfig = require('../helpers/multer')

router.get('/getBucketList', s3Controller.getBucketlist)
router.get('/getDownloadObject/:bucketName/:filename', s3Controller.getDownloadObject)
router.post('/makeBucket', s3Controller.makeBucket)
router.post('/uploadToDir', multerConfig.uploadToDir.single('uploadfile'), s3Controller.uploadObjectFile)
router.post('/uploadToS3/:bucketName', multerConfig.uploadToS3.single('uploadfile'), s3Controller.uploadObject)

module.exports = router